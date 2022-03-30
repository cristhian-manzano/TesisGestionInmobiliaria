const axios = require('axios');
const { Op } = require('sequelize');
const Logger = require('../config/logger');
const { responseStatusCodes } = require('../helpers/constants');
const { getPagination, getPagingData } = require('../helpers/pagination');

const {
  errorResponse,
  successResponse,
  validationResponse
} = require('../helpers/responsesFormat');
const Payment = require('../models/payment');
const PaymentFile = require('../models/PaymentFile');
const PendingPayment = require('../models/pendingPaymentRent');
const Rent = require('../models/rent');
const PaymentObservation = require('../models/paymentObservation');
const sequelize = require('../models/index');
const { uploadFile, deleteFiles } = require('../services/awsService');
const { paymentCreateValidation, paymentObservationValidation } = require('../validation/payment');

const Notification = require('../models/notification');

const create = async (req, res) => {
  try {
    const { error, value } = paymentCreateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    // Validate if code exist

    const paymentCodeExist = await Payment.findOne({
      where: {
        code: {
          [Op.iLike]: `%${value.code}`
        }
      }
    });

    if (paymentCodeExist) {
      return res
        .status(responseStatusCodes.BAD_REQUEST)
        .json(errorResponse(res.statusCode, `Código de comprobante ya existe`));
    }

    // Validate if payed before

    const datePaid = new Date(value.datePaid);
    const month = datePaid.getMonth() + 1;
    const year = datePaid.getFullYear();

    const paymentExist = await Payment.findOne({
      where: {
        [Op.and]: [
          sequelize.where(sequelize.literal(`extract(MONTH FROM "datePaid")`), month),
          sequelize.where(sequelize.literal(`extract(YEAR FROM "datePaid")`), year),
          { idRent: value.idRent },
          { validated: true }
        ]
      }
    });

    if (paymentExist) {
      return res
        .status(responseStatusCodes.CONFLICT)
        .json(errorResponse(res.statusCode, 'Ya ha realizado el pago del mes seleccionado.'));
    }

    // Validate if payed before

    if (!req.file)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, 'File required'));

    const imageUploaded = await uploadFile(req.file, 'payments');

    const paymentFileUploaded = await PaymentFile.create({
      url: imageUploaded.Location,
      key: imageUploaded.Key || imageUploaded.key
    });

    const payment = await Payment.create({
      ...value,
      dateRegister: new Date(),
      idPaymentFile: paymentFileUploaded?.id || null
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', payment));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const getAll = async (req, res) => {
  try {
    const idUser = req.user.id;

    const payments = await Payment.findAll({
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { [Op.or]: [{ idOwner: idUser }, { idTenant: idUser }] }
        },
        {
          model: PaymentFile,
          as: 'paymentFile'
        }
      ],
      order: [
        ['validated', 'ASC'],
        ['paymentDate', 'ASC']
      ]
    });

    // Get ids of users and properties - for request to service
    const paymentDetails = payments.reduce(
      ({ tenants, owners, properties }, { rent }) => ({
        tenants: tenants.concat(tenants.includes(rent.idTenant) ? [] : rent.idTenant),
        owners: owners.concat(owners.includes(rent.idOwner) ? [] : rent.idOwner),
        properties: properties.concat(properties.includes(rent.idProperty) ? [] : rent.idProperty)
      }),
      { properties: [], owners: [], tenants: [] }
    );

    // Refactor this
    const { data: usersResponse } =
      [...paymentDetails.tenants, ...paymentDetails.owners].length > 0 &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: [...paymentDetails.tenants, ...paymentDetails.owners]
      }));

    const { data: propertiesResponse } =
      paymentDetails.properties &&
      (await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
        properties: paymentDetails.properties
      }));

    let data = payments.map((payment) => {
      const owner = usersResponse.data?.find((user) => user.id === payment.rent.idOwner);
      const tenant = usersResponse.data?.find((user) => user.id === payment.rent.idTenant);
      const property = propertiesResponse.data?.find((prop) => prop.id === payment.rent.idProperty);

      return {
        ...payment.dataValues,
        owner,
        tenant,
        property
      };
    });

    // Filterand pagination
    const { search, page, size } = req.query;

    if (search) {
      data = data.filter(
        (d) =>
          d.code.includes(search) ||
          d.tenant.firstName
            ?.concat(' ', d.tenant.lastName)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          d.property.tagName.includes(search)
      );
    }

    if (page || size) {
      const { limit, offset } = getPagination(page, size);
      const pagination = getPagingData(data.length, page, limit);
      data = data.slice(offset, offset + limit);
      return res.status(responseStatusCodes.OK).json(
        successResponse(res.statusCode, 'Successfull request!', {
          pagination,
          results: data
        })
      );
    }

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', data));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const getIncomeByFilter = async (req, res) => {
  try {
    const idUser = req.user.id;
    const { page, size, idProperty, month, year } = req.query;

    const conditions = [
      month ? [sequelize.where(sequelize.literal(`extract(MONTH FROM "datePaid")`), month)] : null,
      year ? [sequelize.where(sequelize.literal(`extract(YEAR FROM "datePaid")`), year)] : null
    ].filter(Boolean);

    const payments = await Payment.findAll({
      where: {
        [Op.and]: [{ validated: true }, ...conditions]
      },
      include: [
        {
          model: Rent,
          as: 'rent',
          where: {
            idOwner: idUser,
            ...(idProperty && { idProperty })
          }
        },
        {
          model: PaymentFile,
          as: 'paymentFile'
        }
      ]
    });

    // Get ids of users and properties - for request to service
    const paymentDetails = payments.reduce(
      ({ tenants, properties }, { rent }) => ({
        tenants: tenants.concat(tenants.includes(rent.idTenant) ? [] : rent.idTenant),
        properties: properties.concat(properties.includes(rent.idProperty) ? [] : rent.idProperty)
      }),
      { properties: [], tenants: [] }
    );

    // Refactor this
    const { data: usersResponse } =
      paymentDetails.tenants.length > 0 &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: paymentDetails.tenants
      }));

    const { data: propertiesResponse } =
      paymentDetails.properties &&
      (await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
        properties: paymentDetails.properties
      }));

    let data = payments.map((payment) => {
      const tenant = usersResponse.data?.find((user) => user.id === payment.rent.idTenant);
      const property = propertiesResponse.data?.find((prop) => prop.id === payment.rent.idProperty);
      return { ...payment.dataValues, tenant, property };
    });

    // Get total
    const totalIncome = payments.reduce(
      (previous, current) => previous + Number(current.amount),
      0
    );

    // Filter and pagination
    if (page || size) {
      const { limit, offset } = getPagination(page, size);
      const pagination = getPagingData(data.length, page, limit);
      data = data.slice(offset, offset + limit);
      return res.status(responseStatusCodes.OK).json(
        successResponse(res.statusCode, 'Successfull request!', {
          pagination,
          results: data,
          totalIncome
        })
      );
    }

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', { results: data, totalIncome }));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const idUser = req.user.id;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Rent,
          as: 'rent',
          where: {
            [Op.or]: [{ idOwner: idUser }, { idTenant: idUser }]
          }
        },
        {
          model: PaymentFile,
          as: 'paymentFile'
        },
        {
          model: PaymentObservation,
          as: 'observations',
          required: false
        }
      ]
    });

    if (!payment)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Payment not found!'));

    // Refactor this
    const usersResponse = await axios.post(`${process.env.API_USER_URL}/user/list`, {
      users: [payment.rent.idOwner, payment.rent.idTenant]
    });

    const propertyResponse = await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
      properties: [payment.rent.idProperty]
    });

    const paymentData = {
      ...payment.dataValues,
      owner: usersResponse.data.data?.find((u) => u.id === payment.rent.idOwner),
      tenant: usersResponse.data.data?.find((u) => u.id === payment.rent.idTenant),
      property: propertyResponse.data.data[0]
    };

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', paymentData));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const destroy = async (req, res) => {
  try {
    const idUser = req.user?.id;
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      where: {
        validated: false
      },
      include: [
        {
          model: Rent,
          as: 'rent',
          where: {
            [Op.or]: [{ idOwner: idUser }, { idTenant: idUser }]
          },
          required: true
        },
        {
          model: PaymentFile,
          as: 'paymentFile'
        }
      ]
    });

    if (!payment)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Pago no encontrado!'));

    let result;

    if (payment.paymentFile) {
      result = await PaymentFile.destroy({ where: { id: payment.idPaymentFile } }); // Lease agrement destroy not necessary, cause is in CASCADE ()
      if (result > 0) {
        await deleteFiles([payment.paymentFile]);
      }
    } else {
      result = await payment.destroy();
    }

    if (result === 0) throw new Error('Cannot delete payment');

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Deleted!', result));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const validatePayment = async (req, res) => {
  try {
    const idUser = req.user?.id;
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { idOwner: idUser },
          attributes: []
        }
      ]
    });

    if (!payment)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'payment not found!'));

    // Valida en caso que update falle
    await payment.update({ validated: true });

    // Remove from pending
    const month = new Date(payment.datePaid).getMonth() + 1;
    const year = new Date(payment.datePaid).getFullYear();

    await PendingPayment.destroy({
      where: {
        [Op.and]: [
          sequelize.where(sequelize.literal(`extract(MONTH FROM "pendingDate")`), month),
          sequelize.where(sequelize.literal(`extract(YEAR FROM "pendingDate")`), year),
          { idRent: payment.idRent }
        ]
      }
    });

    // Endd remove

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Payment validated!', null));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const addObservationPayment = async (req, res) => {
  const { error, value } = paymentObservationValidation(req.body);

  if (error)
    return res
      .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
      .json(validationResponse(res.statusCode, error.message));

  try {
    const idUser = req.user?.id;

    const payment = await Payment.findByPk(value.idPayment, {
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { idOwner: idUser }
        }
      ]
    });

    if (!payment)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'payment not found!'));

    const createdObservation = await PaymentObservation.create({
      description: value.description,
      date: new Date(),
      idPayment: value.idPayment,
      idUser
    });

    if (createdObservation) {
      await Notification.create({
        description: `El pago con código "${payment?.code}" tiene una observación.`,
        entity: 'PaymentObservation',
        idEntity: payment?.id,
        idSender: payment.rent?.idOwner,
        idReceiver: payment.rent?.idTenant
      }).catch((e) => {
        Logger.error(`${e.message}`);
      });
    }

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Pago creado!', createdObservation));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const deleteObservationPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const idUser = req.user?.id;

    const paymentObservation = await PaymentObservation.findOne({
      where: {
        id,
        idUser
      }
    });

    if (!paymentObservation)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'No se pudo borrar la observación.'));

    await paymentObservation.destroy();

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Observación eliminada!', {}));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const getPendingRents = async (req, res) => {
  try {
    const idUser = req.user.id;

    const payments = await PendingPayment.findAll({
      include: [
        {
          model: Rent,
          as: 'rent',
          where: {
            [Op.or]: [{ idOwner: idUser }, { idTenant: idUser }],
            endDate: {
              [Op.eq]: null
            } // Added: only pendingPayments of active rentsTenants
          }
        }
      ],
      order: [['pendingDate', 'DESC']]
    });

    // Get ids of users and properties - for request to service
    const paymentDetails = payments.reduce(
      ({ tenants, owners, properties }, { rent }) => ({
        tenants: tenants.concat(tenants.includes(rent.idTenant) ? [] : rent.idTenant),
        owners: owners.concat(owners.includes(rent.idOwner) ? [] : rent.idOwner),
        properties: properties.concat(properties.includes(rent.idProperty) ? [] : rent.idProperty)
      }),
      { properties: [], owners: [], tenants: [] }
    );

    // Refactor this
    const { data: usersResponse } =
      [...paymentDetails.tenants, ...paymentDetails.owners].length > 0 &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: [...paymentDetails.tenants, ...paymentDetails.owners]
      }));

    const { data: propertiesResponse } =
      paymentDetails.properties &&
      (await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
        properties: paymentDetails.properties
      }));

    let data = payments.map((payment) => {
      const owner = usersResponse.data?.find((user) => user.id === payment.rent.idOwner);
      const tenant = usersResponse.data?.find((user) => user.id === payment.rent.idTenant);
      const property = propertiesResponse.data?.find((prop) => prop.id === payment.rent.idProperty);

      return {
        ...payment.dataValues,
        owner,
        tenant,
        property
      };
    });

    // Filtrado pagination
    const { search, page, size } = req.query;

    if (search) {
      data = data.filter(
        (d) =>
          d.tenant.firstName
            ?.concat(' ', d.tenant.lastName)
            .toLowerCase()
            .includes(search.toLowerCase()) || d.property.tagName.includes(search)
      );
    }

    if (page || size) {
      const { limit, offset } = getPagination(page, size);
      const pagination = getPagingData(data.length, page, limit);
      data = data.slice(offset, offset + limit);
      return res.status(responseStatusCodes.OK).json(
        successResponse(res.statusCode, 'Successfull request!', {
          pagination,
          results: data
        })
      );
    }

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', data));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

module.exports = {
  getAll,
  create,
  get,
  destroy,
  validatePayment,
  getIncomeByFilter,
  getPendingRents,
  addObservationPayment,
  deleteObservationPayment
};
