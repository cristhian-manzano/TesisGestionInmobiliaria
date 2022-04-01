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

const paymentObservationValidation = (data) => {
  const scheme = Joi.object({
    idPayment: Joi.number().required(),
    description: Joi.string().max(255).required()
  });

  return scheme.validate(data);
};

const pendingPaymentValidation = (data) => {
  const scheme = Joi.object({
    idRent: Joi.number().required(),
    date: Joi.date().required()
  });

  return scheme.validate(data);
};

module.exports = {
  paymentCreateValidation,
  paymentObservationValidation,
  pendingPaymentValidation
};
