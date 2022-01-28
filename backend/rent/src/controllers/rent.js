require('dotenv').config();
const axios = require('axios');
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
    const authUserId = req.user.id;

    const rents = await Rent.findAll({
      where: {
        idOwner: authUserId
      }
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', rents));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const create = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const { error, value } = createValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    // Validate if property and tenant exists
    await axios.get(`${process.env.API_PROPERTY_URL}/property/${value.idProperty}`);
    await axios.get(`${process.env.API_USER_URL}/user/${value.idTenant}`);

    const createdRent = await Rent.create({
      ...value,
      idOwner: authUserId
    });

    // Result property and result tenant
    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', createdRent));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const get = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const { id: idRent } = req.params;

    const rent = await Rent.findOne({
      where: {
        [Op.and]: [{ id: idRent }, { idOwner: authUserId }]
      }
    });

    if (!rent)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Rent not found!'));

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', rent));
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
      .json(successResponse(res.statusCode, 'Got it!', deleted));
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
