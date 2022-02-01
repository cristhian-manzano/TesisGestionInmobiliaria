const Joi = require('joi');

const observationCreateValidation = (data) => {
  const scheme = Joi.object({
    description: Joi.string().max(300).required(),
    solved: Joi.boolean().required(),
    idRent: Joi.number().required()
  });

  return scheme.validate(data);
};

const observationUpdateValidation = (data) => {
  const scheme = Joi.object({
    description: Joi.string().max(300),
    solved: Joi.boolean()
  });

  return scheme.validate(data);
};

module.exports = { observationCreateValidation, observationUpdateValidation };
