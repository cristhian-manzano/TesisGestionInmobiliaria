const axios = require('axios');

// Reponse
const { responseStatusCodes } = require('../helpers/constants');
const { errorResponse } = require('../helpers/responsesFormat');

const Logger = require('../config/logger');

const validateToken = async (req, res, next) => {
  try {
    const url = process.env.API_USER_URL;
    const token = req.headers?.authorization || req.headers?.Authorization;

    const response = await axios.post(`${url}/auth/token`, {
      token
    });

    req.user = response.data?.data;
    return next();
  } catch (e) {
    Logger.error('ERROR: ', e.message);
    return res
      .status(responseStatusCodes.UNAUTHORIZED)
      .json(errorResponse(res.statusCode, 'Invalid Authentication!'));
  }
};

module.exports = { validateToken };
