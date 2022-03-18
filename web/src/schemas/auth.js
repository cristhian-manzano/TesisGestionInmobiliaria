import * as yup from 'yup';

export const loginSchema = yup
  .object({
    email: yup.string().email('Ingrese un email valido.').required('Email es requerido'),
    password: yup.string().required('Contraseña es requerida.')
  })
  .required();

export const registerScheme = yup
  .object({
    firstName: yup.string().required('Nombre es requerido.'),
    lastName: yup.string().required('Apellido es requerido.'),
    idCard: yup.string().required('Cédula es requerida.'),
    phone: yup.string(),
    email: yup.string().email('Ingrese un email valido.').required('Email es requerido.'),
    password: yup
      .string()
      .required('Contraseña es requerida.')
      .min(6, 'Longitud mínima de 6 caracteres.'),
    roles: yup.array().min(1, 'Debe seleccionar por lo menos un rol').required('Rol es requerido.'),
    dateOfBirth: yup.date().required('Fecha de nacimiento requerida.')
  })
  .required();
