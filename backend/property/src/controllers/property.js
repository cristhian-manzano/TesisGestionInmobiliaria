const { Op } = require('sequelize');
const axios = require('axios');
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
const { getPagination, getPagingData } = require('../helpers/pagination');

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

    let properties = await Property.findAll({
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

    //  Filter
    const { page, size, search } = req.query;

    if (search) {
      properties = properties.filter(
        (property) =>
          property.tagName.toLowerCase().includes(search.toLowerCase()) ||
          property.typeProperty?.name?.toLowerCase().includes(search.toLowerCase()) ||
          property.sector?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (page || size) {
      const { limit, offset } = getPagination(page, size);
      const pagination = getPagingData(properties.length, page, limit);
      properties = properties.slice(offset, offset + limit);
      return res.status(responseStatusCodes.OK).json(
        successResponse(res.statusCode, 'Successfull request!', {
          pagination,
          results: properties
        })
      );
    }

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
    const propertyExist = await Property.findOne({
      where: {
        tagName: {
          [Op.iLike]: `%${value.tagName}`
        },
        idOwner: req.user?.id
      }
    });

    if (propertyExist) {
      return res
        .status(responseStatusCodes.BAD_REQUEST)
        .json(errorResponse(res.statusCode, `Nombre de propiedad ya existe`));
    }

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

const updateStateProperty = async (req, res) => {
  try {
    const id = req.params?.id;
    const { available } = req.body;

    if (available === null || available === undefined)
      return res
        .status(responseStatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationResponse(res.statusCode, 'Property available not found in body request.'));

    const property = await Property.findByPk(id);

    if (!property)
      return res
        .status(responseStatusCodes.NOT_FOUND)
        .json(errorResponse(res.statusCode, `Property "${id}" not found!`));

    // Update Property

    let updated = property;

    if (property.available !== available) {
      updated = await property.update({ available });
    }

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Updated!', updated));
  } catch (e) {
    Logger.error('ERROR: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

const getPublicProperties = async (req, res) => {
  try {
    const { page, size, idTypeProperty, idSector } = req.query;

    const { limit, offset } = getPagination(page, size);

    const properties = await Property.findAll({
      where: { available: true },

      include: [
        {
          model: ImagesProperty,
          as: 'ImagesProperties'
        },
        {
          model: TypeProperty,
          as: 'typeProperty',
          ...(idTypeProperty && { where: { id: idTypeProperty } })
        },
        {
          model: Sector,
          as: 'sector',
          ...(idSector && { where: { id: idSector } })
        }
      ],
      offset,
      limit
    });

    const pagination = getPagingData(properties.length, page, limit);

    const owners = properties.reduce(
      (prev, cur) => (prev.includes(cur.idOwner) ? prev : prev.concat(cur.idOwner)),
      []
    );

    const ownersData =
      owners.length > 0 &&
      (await axios.post(`${process.env.API_USER_URL}/user/list`, {
        users: owners
      }));

    const results = properties.map((p) => {
      const owner = ownersData.data.data.find((o) => p.idOwner === o.id);
      return {
        ...p.dataValues,
        owner
      };
    });

    return res
      .status(responseStatusCodes.OK)
      .json(successResponse(res.statusCode, 'Successfull request!', { pagination, results }));
  } catch (e) {
    Logger.error('Error: ', e.message);
    return res
      .status(responseStatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorResponse(res.statusCode, 'Internal server errror.'));
  }
};

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy,
  getByOwner,
  getlistProperties,
  updateStateProperty,
  getPublicProperties
};
