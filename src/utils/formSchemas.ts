import * as yup from 'yup';

export const optionsStringSchema = yup
  .object()
  .shape({
    id: yup.string().required().default('default'),
    title: yup.string().required().default('default'),
  })
  .nullable()
  .default(null);

export const optionsNumberSchema = yup
  .object()
  .shape({
    id: yup.number().required().default(0),
    title: yup.string().required().default('default'),
  })
  .nullable()
  .default(null);

export const optionsBooleanSchema = yup
  .object()
  .shape({
    id: yup.boolean().required().default(false),
    title: yup.string().required().default('default'),
  })
  .nullable()
  .default(null);
