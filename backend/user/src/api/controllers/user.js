const { Op } = require('sequelize');

const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} = require('../helpers/statusCodes');
const {
  successResponse,
  errorResponse,
  validationResponse
} = require('../helpers/responsesFormat');

const Logger = require('../../config/logger');

// Models
const User = require('../models/user');
const Role = require('../models/role');
const { updateByAdminValidation, updateProfileValidation } = require('../validations/user');
const { encryptData } = require('../helpers/functions');

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
          name: 'Arrendatario'
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

const getListUsers = async (req, res) => {
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

const getUsersByAdmin = async (req, res) => {
  try {
    const user = req.User ?? {};

    const roles = user.roles?.map((role) => role.name) ?? [];

    if (roles.includes('Administrador')) {
      const UsersData = await User.findAll({
        where: {
          id: {
            [Op.ne]: user.id
          }
        },
        include: {
          model: Role,
          as: 'roles'
        },
        attributes: {
          exclude: ['password']
        }
      });

      return res.status(OK).json(successResponse(res.statusCode, 'Ok!', UsersData));
    }

    return res.status(UNAUTHORIZED).json(errorResponse(res.statusCode, 'No authorized!'));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get users.'));
  }
};

const updateProfile = async (req, res) => {
  try {
    // Validate admin
    const userOwner = req.User ?? {};
    const { error, value } = updateProfileValidation(req.body);
    // Validate body

    if (error)
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const userData = await User.findByPk(userOwner.id);

    if (!userData) {
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Error updating profile!'));
    }

    if (value.password) value.password = await encryptData(value.password);

    await userData.update(value);

    return res.status(OK).json(successResponse(res.statusCode, 'Updated!', {}));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot update profile.'));
  }
};

const updateUsersByAdmin = async (req, res) => {
  try {
    const { id: idUser } = req.params;

    // Validate admin
    const admin = req.User ?? {};
    const roles = admin.roles?.map((role) => role.name) ?? [];

    if (roles.includes('Administrador')) {
      // Validate body
      const { error, value } = updateByAdminValidation(req.body);

      if (error)
        return res
          .status(UNPROCESSABLE_ENTITY)
          .json(validationResponse(res.statusCode, error.message));

      const user = await User.findByPk(idUser, {
        id: {
          [Op.ne]: admin.id
        }
      });

      if (!user) {
        return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'User not found!'));
      }

      await user.update(value);

      return res.status(OK).json(successResponse(res.statusCode, 'Updated!', {}));
    }

    return res.status(UNAUTHORIZED).json(errorResponse(res.statusCode, 'No authorized!'));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot update user.'));
  }
};

const deleteUsersByAdmin = async (req, res) => {
  try {
    const { id: idUser } = req.params;

    // Validate admin
    const admin = req.User ?? {};
    const roles = admin.roles?.map((role) => role.name) ?? [];

    if (roles.includes('Administrador')) {
      const user = await User.findByPk(idUser, {
        id: {
          [Op.ne]: admin.id
        }
      });

      if (!user) {
        return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'User not found!'));
      }

      await user.destroy();

      return res.status(OK).json(successResponse(res.statusCode, 'Deleted!', {}));
    }

    return res.status(UNAUTHORIZED).json(errorResponse(res.statusCode, 'No authorized!'));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot delete user.'));
  }
};

module.exports = {
  getById,
  getByFilter,
  getListUsers,
  updateProfile,
  getUsersByAdmin,
  updateUsersByAdmin,
  deleteUsersByAdmin
};
