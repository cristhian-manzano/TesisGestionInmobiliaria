const Joi = require('joi');

const observationCreateValidation = (data) => {
  const scheme = Joi.object({
    description: Joi.string().max(300).required(),
    solved: Joi.boolean().required(),
    idRent: Joi.number().required(),
    idUser: Joi.number().required()
    // date: Joi.date(),
  });

  return scheme.validate(data);
};

module.exports = { observationCreateValidation };
