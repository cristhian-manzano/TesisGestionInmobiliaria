const Joi = require('joi');

const signInValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().max(75).email().required(),
    password: Joi.string().max(50).required()
  });
  return schema.validate(data);
};

const signUpValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    idCard: Joi.string().max(25).required(),
    email: Joi.string().max(75).email().required(),
    password: Joi.string().max(50).required(),
    phone: Joi.string().max(25),
    idRole: Joi.number().required()
  });
  return schema.validate(data);
};

module.exports = { signInValidation, signUpValidation };
