const Joi = require('joi');

const observationCreateValidation = (data) => {
  const scheme = Joi.object({
    description: Joi.string().max(300).required(),
    idRent: Joi.number().required()
  });

  return scheme.validate(data);
};

const observationUpdateValidation = (data) => {
  const scheme = Joi.object({
    description: Joi.string().max(300)
  });

  return scheme.validate(data);
};

module.exports = { observationCreateValidation, observationUpdateValidation };
