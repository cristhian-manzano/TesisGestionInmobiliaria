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

const getByFilter = async (req, res) => {
  try {
    const { email, idCard } = req.query;

    const condition = {
      ...(email && { email }),
      ...(idCard && { idCard })
    };

    const user = await User.findOne({
      where: condition,
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
          id: 2
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

module.exports = { getById, getByFilter, getlistTenants };
