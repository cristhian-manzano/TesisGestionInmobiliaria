const { Op } = require('sequelize');
const { uploadFiles, deleteFiles } = require('../services/awsService');
const { validateCreateProperty, validateUpdateProperty } = require('../validations/property');
const Property = require('../models/property');
const ImagesProperty = require('../models/imageProperty');
const TypeProperty = require('../models/typeProperty');
const Sector = require('../models/sector');
const sequelize = require('../models');

// Reponse
const { responseStatusCodes } = require('../helpers/constants');
const {
  errorResponse,
  validationResponse,
  successResponse
} = require('../helpers/responsesFormat');

const Logger = require('../config/logger');

const getAll = async (req, res) => {
  try {
    const properties = await Property.findAll({
      attributes: { exclude: ['idTypeProperty', 'idSector'] },

      include: [
        {
          model: ImagesProperty,
          as: 'ImagesProperties',
          attributes: {
            exclude: ['idProperty']
          }
        },
        {
          model: TypeProperty,
          as: 'typeProperty',
          attributes: {
            exclude: ['additionalFeatures']
          }
        },
        {
          model: Sector,
          as: 'sector'
        }
      ]
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Successfull request!', properties));
  } catch (e) {
    Logger.error('Error: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

const getByOwner = async (req, res) => {
  try {
    const ownerId = req.user?.id;

    const properties = await Property.findAll({
      attributes: { exclude: ['idTypeProperty', 'idSector'] },

      include: [
        {
          model: ImagesProperty,
          as: 'ImagesProperties',
          attributes: {
            exclude: ['idProperty']
          }
        },
        {
          model: TypeProperty,
          as: 'typeProperty',
          attributes: {
            exclude: ['additionalFeatures']
          }
        },
        {
          model: Sector,
          as: 'sector'
        }
      ],
      where: {
        idOwner: ownerId
      }
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Successfull request!', properties));
  } catch (e) {
    Logger.error('Error: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

const get = async (req, res) => {
  try {
    const id = req.params?.id;

    const property = await Property.findByPk(id, {
      attributes: { exclude: ['idTypeProperty', 'idSector'] },

      include: [
        {
          model: ImagesProperty,
          as: 'ImagesProperties',
          attributes: {
            exclude: ['idProperty']
          }
        },
        {
          model: TypeProperty,
          as: 'typeProperty',
          attributes: {
            exclude: ['additionalFeatures']
          }
        },
        {
          model: Sector,
          as: 'sector'
        }
      ]
    });

    if (!property)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, `Property "${id}" not found!`));

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Successfull request!', property));
  } catch (e) {
    Logger.error('ERROR: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

const create = async (req, res) => {
  const { error, value } = validateCreateProperty(req.body);
  if (error)
    return res
      .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
      .json(validationResponse(res.statusCode, error.message));

  try {
    const result = await sequelize.transaction(async (t) => {
      // got owner id by token
      value.idOwner = req.user?.id;

      const createdProperty = await Property.create(value, { transaction: t });
      const imagesUploaded = (await uploadFiles(req.files)) || [];

      if (imagesUploaded.length > 0) {
        await Promise.all(
          imagesUploaded.map(async (image) => {
            await ImagesProperty.create(
              {
                url: image.Location,
                key: image.Key || image.key,
                idProperty: createdProperty.id
              },
              { transaction: t }
            );
          })
        );
      }

      return createdProperty;
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Successfull request!', result));
  } catch (e) {
    Logger.error('ERROR: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

const update = async (req, res) => {
  const { error, value } = validateUpdateProperty(req.body);

  if (error)
    return res
      .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
      .json(validationResponse(res.statusCode, error.message));

  try {
    const id = req.params?.id;
    const idOwner = req.user?.id;

    const property = await Property.findOne({
      where: {
        [Op.and]: [{ id }, { idOwner }]
      }
    });

    if (!property)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, `Property "${id}" not found!`));

    const result = await sequelize.transaction(async (t) => {
      if (value.deletedImages?.length) {
        // Delete images from aws S3
        await deleteFiles(value.deletedImages);
        // Delete images from database
        await Promise.all(
          value.deletedImages.map(async (image) => {
            await ImagesProperty.destroy({
              where: { id: image.id },
              transaction: t
            });
          })
        );
      }

      const imagesUploaded = (await uploadFiles(req.files)) || [];

      if (imagesUploaded.length > 0) {
        await Promise.all(
          imagesUploaded.map(async (image) => {
            await ImagesProperty.create(
              {
                url: image.Location,
                key: image.Key || image.key,
                idProperty: property.id
              },
              { transaction: t }
            );
          })
        );
      }
      // Update Property
      return property.update(value, { transaction: t });
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Successfull request!', result));
  } catch (e) {
    Logger.error('ERROR: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.params?.id;
    const idOwner = req.user?.id;

    if (Number.isNaN(id))
      return res
        .status(responseStatusCodes.BAD_REQUEST)
        .json(errorResponse(res.statusCode, 'Id parameter is not a number'));

    const property = await Property.findOne({
      where: {
        [Op.and]: [{ id }, { idOwner }]
      },
      include: {
        model: ImagesProperty,
        as: 'ImagesProperties',
        attributes: {
          exclude: ['idProperty']
        }
      }
    });

    if (!property)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, `Property "${id}" not found!`));

    if (property.ImagesProperties?.length) await deleteFiles(property.ImagesProperties);

    await property.destroy();

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Successfull request!', property));
  } catch (e) {
    Logger.error('ERROR: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

const getlistProperties = async (req, res) => {
  try {
    const { properties } = req.body;

    if (!properties || !Array.isArray(properties))
      return res
        .status(responseStatusCodes.BAD_REQUEST)
        .json(errorResponse(res.statusCode, 'Invalid property lists!'));

    const PropertiesData = await Property.findAll({
      where: {
        id: properties
      },
      include: [
        {
          model: TypeProperty,
          as: 'typeProperty',
          attributes: {
            exclude: ['additionalFeatures']
          }
        },
        {
          model: Sector,
          as: 'sector'
        }
      ]
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Ok!', PropertiesData));
  } catch (e) {
    Logger.error(e.toString());
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Cannot get Properties.'));
  }
};

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy,
  getByOwner,
  getlistProperties
};
