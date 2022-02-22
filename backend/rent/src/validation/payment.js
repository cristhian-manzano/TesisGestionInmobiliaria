const Joi = require('joi');

const paymentCreateValidation = (data) => {
  const scheme = Joi.object({
    code: Joi.string().max(25).required(),
    amount: Joi.number().required(),
    paymentDate: Joi.date().required(),
    datePaid: Joi.date().required(),
    idRent: Joi.number().required()
  });

  return scheme.validate(data);
};

module.exports = { paymentCreateValidation };
