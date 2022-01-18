const Joi = require("joi");

const validateProperty = (data) => {
  const schema = Joi.object({
    tagName: Joi.string().required(),
    description: Joi.string().required(),
    area: Joi.number().required(),
    price: Joi.number().required(),
    address: Joi.string().required(),
    available: Joi.boolean().required(),
    idTypeProperty: Joi.number().required(),
    idSector: Joi.number().required(),
    additionalFeatures: Joi.object(),
    // get owner with token
  });

  try {
    data.additionalFeatures = JSON.parse(data.additionalFeatures);
  } catch (e) {
    console.log("Error aditionalFeatures!");
  }

  return schema.validate(data);
};

module.exports = { validateProperty };
