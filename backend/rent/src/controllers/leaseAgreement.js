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
const { uploadFile } = require('../services/awsService');

const create = async (req, res) => {
  try {
    const { error, value } = leaseAgreementCreateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const result = await sequelize.transaction(async (t) => {
      // Valida en caso de que no se suba
      const imageUploaded = await uploadFile(req.file);

      const contractFileUploaded = await ContractFile.create(
        {
          url: imageUploaded.Location,
          key: imageUploaded.Key || imageUploaded.key
        },
        { transaction: t }
      );

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

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', Leases));
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

    const Lease = await LeaseAgrement.findByPk(id, {
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

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', Lease));
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

    const destroyed = await leaseAgreement.destroy();

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Deleted!', destroyed));
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
