require('dotenv').config();
const { Op } = require('sequelize');
const Logger = require('../config/logger');
const { responseStatusCodes } = require('../helpers/constants');
const {
  errorResponse,
  successResponse,
  validationResponse
} = require('../helpers/responsesFormat');
const Comment = require('../models/comment');
// const Observation = require('../models/observation');

const { commentCreateValidation } = require('../validation/comment');

const getByObservation = async (req, res) => {
  try {
    // const idOwner = req.user?.id;
    const { id: idObservation } = req.params;

    // Validate, you can only get comments of YOUR APARMENT, OR RENTS
    const comments = await Comment.findAll({
      where: { idObservation }
      // include: [
      //   {
      //     model: Observation,
      //     as: 'observation'
      //   }
      // ]
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', comments));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const create = async (req, res) => {
  try {
    const idOwner = req.user?.id;
    const { error, value } = commentCreateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const createdComment = await Comment.create({
      ...value,
      idUser: idOwner,
      date: new Date()
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Created!', createdComment));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const destroy = async (req, res) => {
  try {
    const idOwner = req.user?.id;
    const { id } = req.params;

    const comment = await Comment.findOne({
      where: {
        [Op.and]: [{ id }, { idUser: idOwner }]
      }
    });

    if (!comment)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Comment not found!'));

    const destroyed = await comment.destroy();

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Deleted!', destroyed));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

module.exports = {
  getByObservation,
  create,
  destroy
};
