const { UNAUTHORIZED } = require('../helpers/statusCodes');
const { errorResponse } = require('../helpers/responsesFormat');

const Logger = require('../../config/logger');
const { verifyToken } = require('../helpers/functions');

const User = require('../models/user');
const Role = require('../models/role');

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization || req.headers?.Authorization;
    const userToken = verifyToken(token);

    const user = await User.findByPk(userToken?.id, {
      // attributes: ['id', 'email'],
      include: {
        model: Role,
        as: 'roles'
      }
    });

    if (!user) {
      return res.status(UNAUTHORIZED).json(errorResponse(res.statusCode, 'Invalid Token!'));
    }

    req.User = user;

    return next();
  } catch (e) {
    Logger.error('ERROR: ', e.message);
    return res.status(UNAUTHORIZED).json(errorResponse(res.statusCode, 'Invalid Authentication!'));
  }
};

module.exports = { validateToken };
