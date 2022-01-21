import * as yup from 'yup';

export const propertyScheme = yup
  .object({
    tagName: yup.string().required(),
    description: yup.string().required(),
    area: yup.number().required(),
    price: yup.number().required(),
    address: yup.string().required(),
    idTypeProperty: yup.number().required(),
    sector: yup.object({
      id: yup.number().required()
    })
  })
  .required();
