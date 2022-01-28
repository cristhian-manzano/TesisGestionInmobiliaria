const { Op } = require('sequelize');

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

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { idCard }]
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

    return res.json(successResponse(OK, 'Ok!', user));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get user.'));
  }
};

module.exports = { getById, getByFilter };
