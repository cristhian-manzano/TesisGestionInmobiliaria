require('dotenv').config();

const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const {
  signInValidation,
  signUpValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../validations/auth');

const {
  UNPROCESSABLE_ENTITY,
  CREATED,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK
} = require('../helpers/statusCodes');
const {
  validationResponse,
  successResponse,
  errorResponse
} = require('../helpers/responsesFormat');

const Logger = require('../../config/logger');

// Models
const User = require('../models/user');
const UserRole = require('../models/userRole');
const Role = require('../models/role');

const { createToken, verifyToken, encryptData, verifyEncrypted } = require('../helpers/functions');
const sequelize = require('../models');
const { sendEmail } = require('../services/nodemailer');

const signIn = async (req, res) => {
  const { error, value } = signInValidation(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(validationResponse(res.statusCode, error.message));

  try {
    const user = await User.findOne({
      where: {
        email: value.email
      },
      include: {
        model: Role,
        as: 'roles'
      }
    });

    if (!user)
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Usuario no existe!'));

    if (!(await verifyEncrypted(value.password, user.password)))
      return res
        .status(BAD_REQUEST)
        .json(errorResponse(res.statusCode, 'Credenciales incorrectas!'));

    const tokenCreated = createToken({ id: user.id, email: user.email });

    return res.json(
      successResponse(OK, 'User authenticated!', {
        token: tokenCreated,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles?.map((role) => role.name)
      })
    );
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Error al autenticar usuario.'));
  }
};

const signUp = async (req, res) => {
  const { error, value } = signUpValidation(req.body);

  if (error)
    return res.status(UNPROCESSABLE_ENTITY).json(validationResponse(res.statusCode, error.message));

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: value.email }, { idCard: value.idCard }]
      }
    });

    if (user)
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json(errorResponse(res.statusCode, 'Cédula o correo ya registrados!'));

    // Encrypt password before creating user
    value.password = await encryptData(value.password);

    const resultUserCreated = await sequelize.transaction(async (t) => {
      const createdUser = await User.create(value, { transaction: t });

      // Create roles
      await Promise.all(
        value.roles.map(async (role) => {
          await UserRole.create(
            {
              idUser: createdUser.id,
              idRole: role
            },
            { transaction: t }
          );
        })
      );

      return createdUser;
    });

    return res.status(CREATED).json(
      successResponse(res.statusCode, 'User created!', {
        email: resultUserCreated.email,
        firstName: resultUserCreated.firstName,
        lastName: resultUserCreated.lastName
      })
    );
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot create a user.'));
  }
};

const getUserByToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Token not found'));

  try {
    const userToken = verifyToken(token);

    const user = await User.findByPk(userToken?.id, {
      attributes: ['id', 'email'],
      include: {
        model: Role,
        as: 'roles'
      }
    });

    if (!user)
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'User not found!'));

    return res.status(OK).json(
      successResponse(res.statusCode, 'User obtained!', {
        id: user.id,
        name: user.email,
        roles: user.roles.map((role) => role.name)
      })
    );
  } catch (e) {
    Logger.error(e.toString());
    return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Token invalid!'));
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { error, value } = forgotPasswordValidation(req.body);

    if (error)
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const user = await User.findOne({
      where: {
        email: value.email
      },
      attributes: ['id', 'email']
    });

    if (!user)
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Email not found!'));

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_RESET_PASSWORD_TOKEN,
      {
        expiresIn: 300
      }
    );

    const emailSend = await sendEmail(
      user.email,
      `Reset password - Tésis web`,
      null,
      `<p>Click <a href="${process.env.WEB_URL}/${process.env.WEB_RESET_PASSWORD_ROUTE}/${token}">here</a> to reset your password</p>`
    );

    if (!emailSend)
      return res
        .status(BAD_REQUEST)
        .json(errorResponse(res.statusCode, 'cannot send email, try later!'));

    return res.status(OK).json(successResponse(res.statusCode, 'Success!'));
  } catch (e) {
    Logger.error(e.toString());
    return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Server error!'));
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordValidation(req.body);

    if (error)
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const userToken = jwt.verify(value.token, process.env.JWT_RESET_PASSWORD_TOKEN);
    const user = await User.findByPk(userToken?.id);

    if (!user) {
      return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'User not found!'));
    }
    const encryptedPassword = await encryptData(value.password);
    await user.update({ password: encryptedPassword });
    return res.status(OK).json(successResponse(res.statusCode, 'Success!'));
  } catch (e) {
    Logger.error(e.toString());
    return res.status(BAD_REQUEST).json(errorResponse(res.statusCode, 'Cannot reset password!'));
  }
};

module.exports = { signIn, signUp, getUserByToken, forgotPassword, resetPassword };
