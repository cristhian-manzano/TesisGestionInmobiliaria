const axios = require('axios');
const { Op } = require('sequelize');
const Logger = require('../config/logger');
const { responseStatusCodes } = require('../helpers/constants');
const sequelize = require('../models');

const {
  errorResponse,
  successResponse,
  validationResponse
} = require('../helpers/responsesFormat');

const LeaseAgrement = require('../models/leaseAgreement');
const Rent = require('../models/rent');
const ContractFile = require('../models/ContractFile');
const { leaseAgreementCreateValidation } = require('../validation/leaseAgreement');
const { uploadFile, deleteFiles } = require('../services/awsService');

const create = async (req, res) => {
  try {
    const { error, value } = leaseAgreementCreateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const result = await sequelize.transaction(async (t) => {
      // Valida en caso de que no se suba

      const imageUploaded = req.file && (await uploadFile(req.file));

      let contractFileUploaded;

      if (imageUploaded) {
        contractFileUploaded = await ContractFile.create(
          {
            url: imageUploaded.Location,
            key: imageUploaded.Key || imageUploaded.key
          },
          { transaction: t }
        );
      }

      return LeaseAgrement.create(
        { ...value, idContractFile: contractFileUploaded?.id || null },
        { transaction: t }
      );
    });

    // Result property and result tenant
    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', result));
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

    const Leases = await LeaseAgrement.findAll({
      attributes: { exclude: ['idRent'] },
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { [Op.or]: [{ idOwner: idUser }, { idTenant: idUser }] }
        },
        { model: ContractFile, as: 'contractFile' }
      ]
    });

    // Get ids of users and properties - for request to service
    const LeasesDetails = Leases.reduce(
      ({ tenants, owners, properties }, { rent }) => ({
        tenants: tenants.concat(tenants.includes(rent.idTenant) ? [] : rent.idTenant),
        owners: owners.concat(owners.includes(rent.idOwner) ? [] : rent.idOwner),
        properties: properties.concat(properties.includes(rent.idProperty) ? [] : rent.idProperty)
      }),
      { properties: [], owners: [], tenants: [] }
    );

    // Refactor this
    const { data: usersResponse } =
      [...LeasesDetails.tenants, ...LeasesDetails.owners].length > 0 &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: [...LeasesDetails.tenants, ...LeasesDetails.owners]
      }));

    const { data: propertiesResponse } =
      LeasesDetails.properties &&
      (await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
        properties: LeasesDetails.properties
      }));

    const Data = Leases.map((lease) => {
      const owner = usersResponse.data?.find((user) => user.id === lease.rent.idOwner);
      const tenant = usersResponse.data?.find((user) => user.id === lease.rent.idTenant);
      const property = propertiesResponse.data?.find((prop) => prop.id === lease.rent.idProperty);

      return {
        ...lease.dataValues,
        owner,
        tenant,
        property
      };
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', Data));
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

    const lease = await LeaseAgrement.findByPk(id, {
      include: [
        {
          model: Rent,
          as: 'rent',
          where: {
            [Op.or]: [{ idOwner: idUser }, { idTenant: idUser }]
          }
        },
        {
          model: ContractFile,
          as: 'contractFile'
        }
      ]
    });

    if (!lease)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Lease not found!'));

    // Refactor this
    const usersResponse = await axios.post(`${process.env.API_USER_URL}/user/list`, {
      users: [lease.rent.idOwner, lease.rent.idTenant]
    });

    const propertyResponse = await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
      properties: [lease.rent.idProperty]
    });

    const leaseData = {
      ...lease.dataValues,
      owner: usersResponse.data.data?.find((u) => u.id === lease.rent.idOwner),
      tenant: usersResponse.data.data?.find((u) => u.id === lease.rent.idTenant),
      property: propertyResponse.data.data[0]
    };

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', leaseData));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const destroy = async (req, res) => {
  try {
    const idOwner = req.user?.id;
    const { id } = req.params;

    const leaseAgreement = await LeaseAgrement.findByPk(id, {
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { idOwner },
          attributes: []
        },
        {
          model: ContractFile,
          as: 'contractFile'
        }
      ],
      attributes: {
        exclude: ['idRent']
      }
    });

    if (!leaseAgreement)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'leaseAgreement not found!'));

    let result;

    if (leaseAgreement.contractFile) {
      result = await ContractFile.destroy({ where: { id: leaseAgreement.idContractFile } }); // Lease agrement destroy not necessary, cause is in CASCADE ()
      if (result > 0) await deleteFiles([leaseAgreement.contractFile]);
    } else {
      result = await leaseAgreement.destroy();
    }

    if (result === 0) throw new Error('Cannot delete contract');

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

module.exports = {
  getAll,
  get,
  destroy,
  create
  // update,
};
