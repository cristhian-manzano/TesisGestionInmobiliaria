const Joi = require('joi');

const leaseAgreementCreateValidation = (data) => {
  const scheme = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    active: Joi.boolean().required(),
    idRent: Joi.number().required()
    // file:
  });

  return scheme.validate(data);
};

module.exports = { leaseAgreementCreateValidation };
