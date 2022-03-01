const { Op } = require('sequelize');

const Logger = require('../../config/logger');
const Role = require('../models/role');
const { INTERNAL_SERVER_ERROR, OK } = require('../helpers/statusCodes');
const { errorResponse, successResponse } = require('../helpers/responsesFormat');

const getAll = async (req, res) => {
  const roles = await Role.findAll({
    where: {
      name: {
        [Op.ne]: 'Administrador'
      }
    }
  }).catch((e) => {
    Logger.error(e.toString());
  });

  if (!roles)
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get roles!'));

  return res.status(OK).json(successResponse(res.statusCode, 'success!', roles));
};

module.exports = {
  getAll
};
