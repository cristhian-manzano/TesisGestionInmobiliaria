const Joi = require('joi');

const paymentCreateValidation = (data) => {
  const scheme = Joi.object({
    code: Joi.string().max(25).required(),
    amount: Joi.number().required(),
    validated: Joi.boolean(),
    paymentDate: Joi.date().required(),
    datePaid: Joi.date().required(),
    dateRegister: Joi.date().required(),
    idRent: Joi.number().required()
    // proofOfPayment: --->file
  });

  return scheme.validate(data);
};

module.exports = { paymentCreateValidation };
