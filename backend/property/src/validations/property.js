const Joi = require('joi');
const Logger = require('../config/logger');

const validateCreateProperty = (data) => {
  const schema = Joi.object({
    tagName: Joi.string().required(),
    description: Joi.string().required(),
    area: Joi.number().required(),
    price: Joi.number().required(),
    address: Joi.string().required(),
    idTypeProperty: Joi.number().required(),
    idSector: Joi.number().required(),
    additionalFeatures: Joi.object(),
    available: Joi.boolean()
    // get owner with token
  });

  const validateObject = data;

  try {
    if (validateObject.additionalFeatures)
      validateObject.additionalFeatures = JSON.parse(validateObject.additionalFeatures);
  } catch (e) {
    Logger.error('Error aditionalFeatures!');
  }

  return schema.validate(data);
};

const validateUpdateProperty = (data) => {
  const schema = Joi.object({
    tagName: Joi.string(),
    description: Joi.string(),
    area: Joi.number(),
    price: Joi.number(),
    address: Joi.string(),
    available: Joi.boolean(),
    idTypeProperty: Joi.number(),
    additionalFeatures: Joi.object(),
    deletedImages: Joi.array().items(Joi.object())
  });

  const validateObject = data;

  try {
    if (validateObject.additionalFeatures)
      validateObject.additionalFeatures = JSON.parse(validateObject.additionalFeatures);

    if (validateObject.deletedImages)
      validateObject.deletedImages = JSON.parse(validateObject.deletedImages);
  } catch (e) {
    Logger.error('Error aditionalFeatures!');
  }

  return schema.validate(validateObject);
};

module.exports = { validateCreateProperty, validateUpdateProperty };
