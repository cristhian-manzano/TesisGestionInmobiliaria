require('dotenv').config();
const axios = require('axios');
const { Op } = require('sequelize');
const Logger = require('../config/logger');
const { responseStatusCodes } = require('../helpers/constants');
const {
  errorResponse,
  successResponse,
  validationResponse
} = require('../helpers/responsesFormat');

const Comment = require('../models/comment');
const Observation = require('../models/observation');
const Rent = require('../models/rent');
const Notification = require('../models/notification');

const { commentCreateValidation } = require('../validation/comment');

const getByObservation = async (req, res) => {
  try {
    // Validate, you can only get comments of YOUR APARMENT, OR RENTS
    const idUser = req.user?.id;

    const { id: idObservation } = req.params;

    const comments = await Comment.findAll({
      where: { idObservation },
      order: [['date', 'ASC']]
    });

    // Update read state
    if (comments?.length > 0) {
      await Comment.update(
        { read: true },
        {
          where: {
            [Op.and]: [{ idObservation }, { idUser: { [Op.ne]: idUser } }]
          }
        }
      );
    }

    const usersList = comments.reduce((prev, cur) => {
      if (!prev.includes(cur.idUser)) return [...prev, cur.idUser];
      return prev;
    }, []);

    const users = await axios.post(`${process.env.API_USER_URL}/user/list`, {
      users: usersList
    });

    const commentData = comments.map((comment) => ({
      ...comment.dataValues,
      user: users.data.data.find((user) => comment.idUser === user.id)
    }));

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', commentData));
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

    // ! Start - Experimental

    try {
      const observation = await Observation.findByPk(createdComment.idObservation, {
        include: [
          {
            model: Rent,
            as: 'rent'
          }
        ]
      });

      const userData = await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: [idOwner]
      });

      const receiverId =
        observation.rent?.idTenant !== idOwner
          ? observation.rent?.idTenant
          : observation.rent?.idOwner;

      await Notification.create({
        description: `${userData.data.data[0].lastName} ha comentado la observación "${
          observation.description?.slice(0, 10) ?? ''
        }"...`,
        entity: 'Comment',
        idEntity: createdComment?.id,
        idSender: idOwner,
        idReceiver: receiverId
      });
    } catch (e) {
      console.log(e);
    }

    // ! End - Experimental

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
    const idUser = req.user?.id;
    const { id } = req.params;

    const comment = await Comment.findOne({
      where: {
        [Op.and]: [{ id }, { idUser }]
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
