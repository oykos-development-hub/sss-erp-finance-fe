import * as yup from 'yup';
import {requiredError} from '../constants.ts';

export const optionsStringSchema = yup
  .object()
  .shape({
    id: yup.string().required().default('default'),
    title: yup.string().required().default('default'),
  })
  .nullable()
  .default(null)
  .test('required-field', requiredError, function (value) {
    if (value === null) return true; // Allow null if it's nullable

    const isValid = value?.id !== 'default' && value?.title !== 'default';

    if (!isValid) {
      return this.createError({
        path: this.path, // Associate the error with the entire object
        message: requiredError,
      });
    }

    return true;
  });

export const optionsNumberSchema = yup
  .object()
  .shape({
    id: yup.number().required().default(0),
    title: yup.string().required().default('default'),
  })
  .nullable()
  .default(null)
  .test('required-field', requiredError, function (value) {
    if (value === null) return true; // Allow null if it's nullable

    const isValid = value?.id !== 0 && value?.title !== 'default';

    if (!isValid) {
      return this.createError({
        path: this.path, // Associate the error with the entire object
        message: requiredError,
      });
    }

    return true;
  });

export const optionsBooleanSchema = yup
  .object()
  .shape({
    id: yup.boolean().required().default(false),
    title: yup.string().required().default('default'),
  })
  .nullable()
  .default(null)
  .test('required-field', requiredError, function (value) {
    if (value === null) return true; // Allow null if it's nullable

    const isValid = value?.id !== false && value?.title !== 'default';

    if (!isValid) {
      return this.createError({
        path: this.path, // Associate the error with the entire object
        message: requiredError,
      });
    }

    return true;
  });
