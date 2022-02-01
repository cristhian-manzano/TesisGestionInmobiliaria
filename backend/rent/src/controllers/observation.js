require('dotenv').config();
const { Op } = require('sequelize');
const Logger = require('../config/logger');
const { responseStatusCodes } = require('../helpers/constants');
const {
  errorResponse,
  successResponse,
  validationResponse
} = require('../helpers/responsesFormat');
const Observation = require('../models/observation');
const Rent = require('../models/rent');

const { observationCreateValidation } = require('../validation/observation');

const getAll = async (req, res) => {
  try {
    const idOwner = req.user?.id;

    const observations = await Observation.findAll({
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { idOwner },
          attributes: ['id', 'idOwner', 'idProperty', 'idTenant']
        }
      ],
      attributes: {
        exclude: ['idRent']
      }
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', observations));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const get = async (req, res) => {
  try {
    const idOwner = req.user?.id;
    const { id } = req.params;

    const observation = await Observation.findOne({
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { [Op.and]: [{ idOwner }, { id }] },
          attributes: ['id', 'idOwner', 'idProperty', 'idTenant']
        }
      ],
      attributes: {
        exclude: ['idRent']
      }
    });

    if (!observation)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Observation not found!'));

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', observation));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const create = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { error, value } = observationCreateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const createdObservation = await Observation.create({
      ...value,
      idUser: authUserId,
      date: new Date()
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Created!', createdObservation));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

// const update = (req, res) => {};
// const destroy = (req, res) => {};

module.exports = {
  getAll,
  get,
  create
  // update,
  // destroy
};
