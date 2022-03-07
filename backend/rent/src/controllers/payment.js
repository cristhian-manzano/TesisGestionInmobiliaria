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
const Rent = require('../models/rent');
const sequelize = require('../models/index');
const { uploadFile, deleteFiles } = require('../services/awsService');
const { paymentCreateValidation } = require('../validation/payment');

const create = async (req, res) => {
  try {
    const { error, value } = paymentCreateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

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
          d.tenant.firstName.includes(search) ||
          d.tenant.lastName.includes(search) ||
          d.property.tagName.includes(search) ||
          d.code.includes(search)
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
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { idTenant: idUser },
          attributes: []
        },
        {
          model: PaymentFile,
          as: 'paymentFile'
        }
      ],
      attributes: {
        exclude: ['idRent']
      }
    });

    if (!payment)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'payment not found!'));

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

module.exports = {
  getAll,
  create,
  get,
  destroy,
  validatePayment,
  getIncomeByFilter
};
