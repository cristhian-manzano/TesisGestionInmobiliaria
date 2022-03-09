require('dotenv').config();
const sequelize = require('sequelize');
const axios = require('axios');
const Logger = require('../config/logger');
const { responseStatusCodes } = require('../helpers/constants');
const {
  errorResponse,
  successResponse,
  validationResponse
} = require('../helpers/responsesFormat');
const Observation = require('../models/observation');
const Comment = require('../models/comment');
const Rent = require('../models/rent');

// Experimental
const Notification = require('../models/notification');

const {
  observationCreateValidation,
  observationUpdateValidation
} = require('../validation/observation');

const { getPagination, getPagingData } = require('../helpers/pagination');

const getAll = async (req, res) => {
  try {
    const idUser = req.user?.id;

    const observations = await Observation.findAll({
      include: [
        {
          model: Rent,
          as: 'rent',
          where: {
            [sequelize.Op.or]: [{ idOwner: idUser }, { idTenant: idUser }]
          },
          attributes: ['id', 'idOwner', 'idProperty', 'idTenant']
        },
        {
          model: Comment,
          as: 'comments'
        }
      ],
      attributes: { exclude: ['idRent'] },
      order: [['date', 'DESC']]
    });

    const lists = observations.reduce(
      ({ properties, users }, cur) => ({
        properties: properties ? [...properties, cur.rent.idProperty] : [cur.rent.idProperty],
        users: users ? [...users, cur.idUser] : [cur.idUser]
      }),
      {}
    );

    const usersData =
      lists.users &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: lists.users
      }));

    const propertiesData =
      lists.properties &&
      (await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
        properties: lists.properties
      }));

    let observationsData = observations.map((observation) => ({
      ...observation.dataValues,
      comments: {
        amount: observation.comments?.length,
        unread: observation.comments.filter((comment) => !comment.read && comment.idUser !== idUser)
          ?.length
      },
      user: usersData.data.data.find((user) => observation.idUser === user.id),
      property: propertiesData.data.data.find(
        (property) => observation.rent.idProperty === property.id
      )
    }));

    //  Filter
    const { page, size, search } = req.query;

    if (search) {
      observationsData = observationsData.filter(
        (observation) =>
          observation.user.firstName.includes(search) ||
          observation.user.lastName.includes(search) ||
          observation.description.includes(search)
      );
    }

    if (page || size) {
      const { limit, offset } = getPagination(page, size);
      const pagination = getPagingData(observationsData.length, page, limit);
      observationsData = observationsData.slice(offset, offset + limit);
      return res.status(responseStatusCodes.OK).json(
        successResponse(res.statusCode, 'Successfull request!', {
          pagination,
          results: observationsData
        })
      );
    }

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', observationsData));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const get = async (req, res) => {
  try {
    const idUser = req.user?.id;
    const { id } = req.params;

    const observation = await Observation.findOne({
      where: {
        id
      },
      include: [
        {
          model: Rent,
          as: 'rent',
          where: {
            [sequelize.Op.or]: [{ idOwner: idUser }, { idTenant: idUser }]
          },
          attributes: ['id', 'idOwner', 'idProperty', 'idTenant']
        }
      ],
      attributes: {
        exclude: ['idRent']
      }
    });

    if (!observation)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Observation not found!'));

    // Update state (read)
    if (!observation.read && observation.idUser !== idUser)
      await observation.update({ read: true });

    const user = await axios.post(`${process.env.API_USER_URL}/user/list`, {
      users: [observation.idUser]
    });

    const property = await axios.post(`${process.env.API_PROPERTY_URL}/property/list`, {
      properties: [observation.rent?.idProperty]
    });

    const observationData = {
      ...observation.dataValues,
      user: user.data.data[0],
      property: property.data.data[0]
    };

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Got it!', observationData));
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
    const { error, value } = observationCreateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const createdObservation = await Observation.create({
      ...value,
      idUser: idOwner,
      date: new Date()
    });

    // ! start - Experimental

    try {
      const observation = await Observation.findByPk(createdObservation?.id, {
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
        description: `${userData.data.data[0].lastName} ha creado una observación.`,
        entity: 'Observation',
        idEntity: createdObservation?.id,
        idSender: idOwner,
        idReceiver: receiverId
      });
    } catch (e) {
      console.log(e);
    }

    // ! End - Experimental

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Created!', createdObservation));
  } catch (e) {
    Logger.error(e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, e.message));
  }
};

const update = async (req, res) => {
  try {
    const idOwner = req.user?.id;
    const { id } = req.params;
    const { error, value } = observationUpdateValidation(req.body);

    if (error)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, error.message));

    const observation = await Observation.findOne({
      where: {
        id
      },
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { idOwner },
          attributes: []
        }
      ],
      attributes: {
        exclude: ['idRent']
      }
    });

    if (!observation)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Observation not found!'));

    observation.set(value);

    const updated = await observation.save();

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Updated!', updated));
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

    const observation = await Observation.findOne({
      where: {
        id
      },
      include: [
        {
          model: Rent,
          as: 'rent',
          where: { idOwner },
          attributes: []
        }
      ],
      attributes: {
        exclude: ['idRent']
      }
    });

    if (!observation)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, 'Observation not found!'));

    const destroyed = await observation.destroy();

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
  getAll,
  get,
  create,
  update,
  destroy
};
