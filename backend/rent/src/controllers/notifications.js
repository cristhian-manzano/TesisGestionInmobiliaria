require('dotenv').config();
// const { Op } = require('sequelize');

const Logger = require('../config/logger');
const { responseStatusCodes } = require('../helpers/constants');
const { errorResponse, successResponse } = require('../helpers/responsesFormat');

// Experimental
const Notification = require('../models/notification');

const get = async (req, res) => {
  try {
    const idUser = req.user.id;

    const notifications = await Notification.findAll({
      // where: { [Op.and]: [{ read: false }, { idReceiver: idUser }] }
      where: { idReceiver: idUser },
      order: [['date', 'DESC']]
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', notifications));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const updateToRead = async (req, res) => {
  try {
    const idUser = req.user.id;

    await Notification.update(
      { read: true },
      {
        where: { idReceiver: idUser }
      }
    );

    return res.status(responseStatusCodes.OK).json(successResponse(res.statusCode, 'updated!', {}));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

module.exports = { get, updateToRead };
