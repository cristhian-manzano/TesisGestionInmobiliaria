const { Op } = require('sequelize');

const { signInValidation, signUpValidation } = require('../validations/auth');

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

const { createToken, encryptData, verifyEncrypted } = require('../helpers/functions');

const User = require('../models/user');
const Logger = require('../../config/logger');

const signIn = async (req, res) => {
  const { error, value } = signInValidation(req.body);
  if (error) return res.json(validationResponse(UNPROCESSABLE_ENTITY, error.message));

  try {
    const user = await User.findOne({
      where: {
        email: value.email
      }
    });

    if (!user) return res.json(errorResponse(BAD_REQUEST, 'Invalid credentials!'));

    if (!(await verifyEncrypted(value.password, user.password)))
      return res.json(errorResponse(BAD_REQUEST, 'Invalid credentials!'));

    const token = createToken({ id: user.id, email: user.email });

    return res.json(
      successResponse(OK, 'User authenticated!', {
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        idRole: user.idRole
      })
    );
  } catch (e) {
    Logger.error(e.toString());
    return res.json(errorResponse(INTERNAL_SERVER_ERROR, 'Cannot authenticate user.'));
  }
};

const signUp = async (req, res) => {
  const { error, value } = signUpValidation(req.body);
  if (error) return res.json(validationResponse(UNPROCESSABLE_ENTITY, error.message));

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: value.email, idCard: value.idCard }]
      }
    });

    if (user) return res.json(validationResponse(UNPROCESSABLE_ENTITY, 'User already exists!'));

    value.password = await encryptData(value.password);
    const createdUser = await User.create(value);
    return res.json(successResponse(CREATED, 'User created!', createdUser));
  } catch (e) {
    Logger.error(e.toString());
    return res.json(errorResponse(INTERNAL_SERVER_ERROR, 'Cannot create a user.'));
  }
};

module.exports = { signIn, signUp };
