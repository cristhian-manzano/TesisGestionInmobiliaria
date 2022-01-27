const { Op } = require('sequelize');
const Rent = require('../models/rent');

const Logger = require('../config/logger');
const { createValidation } = require('../validation/rent');
const { responseStatusCodes } = require('../helpers/constants');

const {
  validationResponse,
  errorResponse,
  successResponse
} = require('../helpers/responsesFormat');

const getAll = async (req, res) => {
  try {
    const authUserId = req.user?.id || 1;

    const rents = await Rent.findAll({
      where: {
        idOwner: authUserId
      }
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Get it!', rents));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const create = (req, res) => {
  const { error, value } = createValidation(req.body);

  if (error)
    return res
      .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
      .json(validationResponse(res.statusCode, error.message));

  return value;
};

const get = async (req, res) => {
  try {
    const authUserId = req.user?.id || 1;
    const { id: idRent } = req.params;

    const rent = await Rent.findOne({
      where: {
        [Op.and]: [{ id: idRent }, { idOwner: authUserId }]
      }
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Get it!', rent));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const destroy = async (req, res) => {
  try {
    const authUserId = req.user?.id || 1;
    const { id: idRent } = req.params;

    const deleted = await Rent.destroy({
      where: {
        [Op.and]: [{ id: idRent }, { idOwner: authUserId }]
      }
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Get it!', deleted));
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
  destroy,
  get
};
