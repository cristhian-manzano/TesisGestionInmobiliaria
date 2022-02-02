const Joi = require('joi');

const rentCreateValidation = (data) => {
  const scheme = Joi.object({
    securityDeposit: Joi.number(),
    paymentDay: Joi.number(),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
    idProperty: Joi.number().required(),
    idTenant: Joi.number().required()
  });

  return scheme.validate(data);
};

const rentUpdateValidation = (data) => {
  const scheme = Joi.object({
    securityDeposit: Joi.number(),
    paymentDay: Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date()
  });

  return scheme.validate(data);
};

module.exports = {
  rentCreateValidation,
  rentUpdateValidation
};
