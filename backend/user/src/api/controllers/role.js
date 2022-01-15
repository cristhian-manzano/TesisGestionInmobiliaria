const Logger = require('../../config/logger');
const Role = require('../models/role');
const { INTERNAL_SERVER_ERROR, OK } = require('../helpers/statusCodes');
const { errorResponse, successResponse } = require('../helpers/responsesFormat');

const getAll = async (req, res) => {
  const roles = await Role.findAll().catch((e) => {
    Logger.error(e.toString());
  });

  if (!roles)
    res.status(INTERNAL_SERVER_ERROR).json(errorResponse(res.statusCode, 'Cannot get roles!'));

  res.status(OK).json(successResponse(res.statusCode, 'success!', roles));
};

module.exports = {
  getAll
};
