require('dotenv').config();
const axios = require('axios');
const { Op } = require('sequelize');
const Rent = require('../models/rent');

const Logger = require('../config/logger');
const { rentCreateValidation, rentUpdateValidation } = require('../validation/rent');
const { responseStatusCodes } = require('../helpers/constants');

const {
  validationResponse,
  errorResponse,
  successResponse
} = require('../helpers/responsesFormat');
const { getPagination, getPagingData } = require('../helpers/pagination');

const getAll = async (req, res) => {
  try {
    const idOwner = req.user.id;
    const rents = await Rent.findAll({
      where: { idOwner },
      order: [
        ['endDate', 'DESC'],
        ['startDate', 'DESC']
      ]
    });

    const lists = rents.reduce(
      (prev, cur) => ({
        properties: prev.properties ? [...prev.properties, cur.idProperty] : [cur.idProperty],
        tenants: prev.tenants ? [...prev.tenants, cur.idTenant] : [cur.idTenant]
      }),
      {}
    );

    // ! Que pasa si hay usuarios o propiedades eliminad@s, [vendrian datos incompletos] - Manejalo
    // ! Solución temporal

    const tenants =
      lists.tenants &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: lists.tenants
      }));

    const properties =
      lists.properties &&
      (await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
        properties: lists.properties
      }));

    let rentsData = rents.map((rent) => {
      const tenant = tenants.data.data.find((t) => rent.idTenant === t.id);
      const property = properties.data.data.find((p) => rent.idProperty === p.id);

      return {
        ...rent.dataValues,
        tenant,
        property
      };
    });

    //  Filter
    const { page, size, search } = req.query;

    if (search) {
      rentsData = rentsData.filter(
        ({ property = {}, tenant = {} }) =>
          property.tagName?.includes(search) ||
          tenant.firstName
            ?.concat(' ', tenant.lastName)
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (page || size) {
      const { limit, offset } = getPagination(page, size);
      const pagination = getPagingData(rentsData.length, page, limit);
      rentsData = rentsData.slice(offset, offset + limit);
      return res.status(responseStatusCodes.OK).json(
        successResponse(res.statusCode, 'Successfull request!', {
          pagination,
          results: rentsData
        })
      );
    }

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

const getAllByTenant = async (req, res) => {
  try {
    const idTenant = req.user.id;
    const rents = await Rent.findAll({
      where: { idTenant }
    });

    const lists = rents.reduce(
      (prev, cur) => ({
        properties: prev.properties ? [...prev.properties, cur.idProperty] : [cur.idProperty],
        owners: prev.owners ? [...prev.owners, cur.idOwner] : [cur.idOwner]
      }),
      {}
    );

    // ! Que pasa si hay usuarios o propiedades eliminad@s, [vendrian datos incompletos] - Manejalo
    // ! Solución temporal

    const owners =
      lists.owners &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: lists.owners
      }));

    const properties =
      lists.properties &&
      (await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
        properties: lists.properties
      }));

    let rentsData = rents.map((rent) => ({
      ...rent.dataValues,
      owner: owners.data.data.find((owner) => rent.idOwner === owner.id),
      property: properties.data.data.find((property) => rent.idProperty === property.id)
    }));

    //  Filter
    const { page, size, search } = req.query;

    if (search) {
      rentsData = rentsData.filter(
        (rent) =>
          rent.property.tagName.includes(search) ||
          rent.owner.firstName
            ?.concat(' ', rent.owner.lastName)
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (page || size) {
      const { limit, offset } = getPagination(page, size);
      const pagination = getPagingData(rentsData.length, page, limit);
      rentsData = rentsData.slice(offset, offset + limit);
      return res.status(responseStatusCodes.OK).json(
        successResponse(res.statusCode, 'Successfull request!', {
          pagination,
          results: rentsData
        })
      );
    }

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
    const authUserId = req.user?.id;
    const { error, value } = rentCreateValidation(req.body);

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

    // Update status property
    await axios.put(
      `${process.env.API_PROPERTY_URL}/property/${createdRent.idProperty}/availability`,
      { available: false },
      {
        headers: {
          Authorization: `${req.user.token}`
        }
      }
    );

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

const update = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id: idRent } = req.params;
    const { error, value } = rentUpdateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const rent = await Rent.findOne({
      where: {
        [Op.and]: [{ id: idRent }, { idOwner: authUserId }]
      }
    });

    if (!rent)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Rent not found!'));

    rent.set(value);
    const updatedRent = await rent.save();

    // Result property and result tenant
    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', updatedRent));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const get = async (req, res) => {
  try {
    // valida que solo pueda ver el usuario correspondiente
    const { id: idRent } = req.params;

    const rent = await Rent.findOne({ where: { id: idRent } });

    if (!rent)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Rent not found!'));

    const tenant =
      rent.idTenant &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: [rent.idTenant]
      }));

    // Temporaal
    const owner =
      rent.idOwner &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: [rent.idOwner]
      }));

    const property =
      rent.idProperty &&
      (await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
        properties: [rent.idProperty]
      }));

    const rentsData = {
      ...rent.dataValues,
      tenant: tenant.data.data[0],
      owner: owner.data.data[0],
      property: property.data.data[0]
    };

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

const destroy = async (req, res) => {
  try {
    const authUserId = req.user?.id;
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

    await rent.destroy();

    // Update status property
    await axios.put(
      `${process.env.API_PROPERTY_URL}/property/${rent.idProperty}/availability`,
      { available: true },
      {
        headers: {
          Authorization: `${req.user.token}`
        }
      }
    );

    return res.status(responseStatusCodes.OK).json(successResponse(res.statusCode, 'Deleted!'));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const finishRent = async (req, res) => {
  try {
    const authUserId = req.user?.id;
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

    await rent.update({ endDate: new Date() });

    // Update status property
    await axios.put(
      `${process.env.API_PROPERTY_URL}/property/${rent.idProperty}/availability`,
      { available: true },
      {
        headers: {
          Authorization: `${req.user.token}`
        }
      }
    );

    // Result property and result tenant
    return res.status(responseStatusCodes.OK).json(successResponse(res.statusCode, 'Updated!', {}));
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
  get,
  update,
  getAllByTenant,
  finishRent
};
