const Joi = require('joi');

const commentCreateValidation = (data) => {
  const scheme = Joi.object({
    description: Joi.string().max(500).required(),
    idObservation: Joi.number().required()
  });

  return scheme.validate(data);
};

module.exports = { commentCreateValidation };
