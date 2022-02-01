require('dotenv').config();
// const { Op } = require('sequelize');
const Logger = require('../config/logger');
const { responseStatusCodes } = require('../helpers/constants');
const {
  errorResponse,
  successResponse,
  validationResponse
} = require('../helpers/responsesFormat');
const Observation = require('../models/observation');
const Rent = require('../models/rent');

const {
  observationCreateValidation,
  observationUpdateValidation
} = require('../validation/observation');

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
      where: {
        id
      },
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
    const idOwner = req.user?.id;
    const { error, value } = observationCreateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const createdObservation = await Observation.create({
      ...value,
      idUser: idOwner,
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

const update = async (req, res) => {
  try {
    const idOwner = req.user?.id;
    const { id } = req.params;
    const { error, value } = observationUpdateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const observation = await Observation.findOne({
      where: {
        id
      },
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

    if (!observation)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Observation not found!'));

    observation.set(value);

    const updated = await observation.save();

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Updated!', updated));
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

    const observation = await Observation.findOne({
      where: {
        id
      },
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

    if (!observation)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Observation not found!'));

    const destroyed = await observation.destroy();

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
  create,
  update,
  destroy
};
