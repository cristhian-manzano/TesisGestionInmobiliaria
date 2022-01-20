const Sector = require('../models/sector');

// Reponse
const { responseStatusCodes } = require('../helpers/constants');
const { errorResponse, successResponse } = require('../helpers/responsesFormat');

const Logger = require('../config/logger');

const get = async (req, res) => {
  try {
    const sectors = await Sector.findAll();

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Successfull request!', sectors));
  } catch (e) {
    Logger.error('Error: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

module.exports = {
  get
};
