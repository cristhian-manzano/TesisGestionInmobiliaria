const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = require('../helpers/statusCodes');
const { successResponse, errorResponse } = require('../helpers/responsesFormat');

const Logger = require('../../config/logger');

// Models
const User = require('../models/user');
const Role = require('../models/role');

const getById = async (req, res) => {
  try {
    const { id: idUser } = req.params;

    const user = await User.findOne({
      where: {
        id: idUser
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    });

    if (!user)
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'User not found!'));

    return res.json(successResponse(OK, 'Ok!', user));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get user.'));
  }
};

const getTenantById = async (req, res) => {
  try {
    const { id: idUser } = req.params;

    const user = await User.findOne({
      where: {
        id: idUser
      },
      include: {
        model: Role,
        as: 'roles',
        attributes: [],
        where: {
          // Move it to a variable
          id: 2
        }
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    });

    if (!user)
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Tenant not found!'));

    return res.json(successResponse(OK, 'Ok!', user));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get tenant.'));
  }
};

const getByFilter = async (req, res) => {
  try {
    const { email, idCard } = req.query;

    // Validate email and idCard (with joi)
    if (!(email || idCard))
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Invalid request!'));

    const user = await User.findOne({
      where: {
        ...(email && { email }),
        ...(idCard && { idCard })
      },
      include: {
        model: Role,
        as: 'roles',
        attributes: [],
        where: {
          // Move it to a variable
          id: 2
        }
      },
      attributes: {
        exclude: ['password', 'dateOfBirth', 'updatedAt', 'createdAt']
      }
    });

    if (!user)
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'User not found!'));

    return res.status(OK).json(successResponse(res.statusCode, 'Ok!', user));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get user.'));
  }
};

const getlistUsers = async (req, res) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users))
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Invalid user lists!'));

    const UsersData = await User.findAll({
      where: {
        id: users
      },
      include: {
        model: Role,
        as: 'roles',
        attributes: [],
        where: {
          // Move it to a variable
          name: ['Arrendador', 'Arrendatario']
        }
      },
      attributes: {
        exclude: ['password', 'dateOfBirth', 'updatedAt', 'createdAt']
      }
    });

    return res.status(OK).json(successResponse(res.statusCode, 'Ok!', UsersData));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get user.'));
  }
};

const getlistTenants = async (req, res) => {
  try {
    const { tenants } = req.body;

    if (!tenants || !Array.isArray(tenants))
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Invalid tenant lists!'));

    const tenantsData = await User.findAll({
      where: {
        id: tenants
      },
      include: {
        model: Role,
        as: 'roles',
        attributes: [],
        where: {
          // Move it to a variable
          name: 'Arrendatario'
        }
      },
      attributes: {
        exclude: ['password', 'dateOfBirth', 'updatedAt', 'createdAt']
      }
    });

    return res.status(OK).json(successResponse(res.statusCode, 'Ok!', tenantsData));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get user.'));
  }
};

module.exports = { getById, getByFilter, getlistTenants, getTenantById, getlistUsers };
