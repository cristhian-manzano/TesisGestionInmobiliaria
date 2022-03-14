const Joi = require('joi');

const updateByAdminValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().max(100),
    lastName: Joi.string().max(100),
    idCard: Joi.string().max(25),
    email: Joi.string().max(75).email(),
    phone: Joi.string().max(25),
    dateOfBirth: Joi.date()
  });

  return schema.validate(data);
};

const updateProfileValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string().max(25),
    password: Joi.string().max(50)
  });

  return schema.validate(data);
};

module.exports = {
  updateByAdminValidation,
  updateProfileValidation
};
