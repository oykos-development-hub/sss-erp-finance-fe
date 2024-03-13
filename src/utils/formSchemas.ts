import * as yup from 'yup';

export const optionsStringSchema = yup.object().shape({
  id: yup.string().required(),
  title: yup.string().required(),
});

export const optionsNumberSchema = yup.object().shape({
  id: yup.number().required(),
  title: yup.string().required(),
});

export const optionsBooleanSchema = yup.object().shape({
  id: yup.boolean().required(),
  title: yup.string().required(),
});
