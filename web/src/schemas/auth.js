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
    idCard: yup
      .string()
      .required('Cédula es requerida.')
      .matches(/^\d+$/, 'Solo se permiten números.')
      .max(15, 'La longitud máxima es de 15 caracteres.')
      .min(10, 'La longitud mínima es de 10 caracteres.'),
    phone: yup
      .string()
      .required('Teléfono es requerido')
      .min(10, 'La longitud mínima es de 10 caracteres.')
      .max(15, 'La longitud máxima es de 15 caracteres.')
      .matches(/^\d+$/, 'Solo se permiten números.'),
    email: yup.string().email('Ingrese un email valido.').required('Email es requerido.'),
    password: yup
      .string()
      .required('Contraseña es requerida.')
      .min(6, 'Longitud mínima de 6 caracteres.'),
    // roles: yup.array().min(1, 'Debe seleccionar por lo menos un rol').required('Rol es requerido.'),
    role: yup.number().required('Rol es requerido.'),
    dateOfBirth: yup.date().required('Fecha de nacimiento requerida.')
  })
  .required();
