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

    const lists = rents.reduce(
      (prev, cur) => ({
        properties: prev.properties ? [...prev.properties, cur.idProperty] : [cur.idProperty],
        tenants: prev.tenants ? [...prev.tenants, cur.idTenant] : [cur.idTenant]
      }),
      {}
    );

    // ! Que pasa si hay usuarios o propiedades eliminad@s, [vendrian datos incompletos] - Manejalo
    const tenants = await axios.post(`${process.env.API_USER_URL}/user/tenant/list`, {
      tenants: lists.tenants
    });
    const properties = await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
      properties: lists.properties
    });

    const rentsData = rents.map((rent) => ({
      ...rent.dataValues,
      tenant: tenants.data.data.find((tenant) => rent.idTenant === tenant.id),
      property: properties.data.data.find((property) => rent.idProperty === property.id)
    }));

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', rentsData));
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

    // Has to be a tenant (Validate!!)
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
