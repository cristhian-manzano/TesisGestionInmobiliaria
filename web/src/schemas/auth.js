import * as yup from 'yup';

export const loginSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required()
  })
  .required();

export const registerScheme = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    idCard: yup.string().required(),
    phone: yup.string(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    roles: yup.array().min(1).required(),
    dateOfBirth: yup.date().required()
  })
  .required();
