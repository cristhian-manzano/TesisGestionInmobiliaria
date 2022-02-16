const Joi = require('joi');

const leaseAgreementCreateValidation = (data) => {
  const scheme = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    idRent: Joi.number().required()
    // active: Joi.boolean().required(),
  });

  return scheme.validate(data);
};

module.exports = { leaseAgreementCreateValidation };
