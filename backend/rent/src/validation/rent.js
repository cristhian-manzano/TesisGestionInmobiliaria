const Joi = require('joi');

const createValidation = (data) => {
  const scheme = Joi.object({
    securityDeposit: Joi.number(),
    paymentDay: Joi.number(),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
    idProperty: Joi.number(),
    idTenant: Joi.number()
  });

  return scheme.validate(data);
};

module.exports = {
  createValidation
};
