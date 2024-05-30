import * as yup from 'yup';
import {requiredError} from '../../../../constants';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';

export const contractsSchema = yup.object().shape({
  id: yup.number(),
  invoice_number: yup.string().required(requiredError),
  net_price: yup
    .number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable(),
  gross_price: yup
    .number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable(),
  previous_income_net: yup
    .number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable(),
  previous_income_gross: yup
    .number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable(),
  issuer: yup.string().default(null).required(requiredError),
  tax_authority_codebook_id: optionsNumberSchema.required(requiredError).default(null),
  supplier_id: optionsNumberSchema.default(null).required(requiredError),
  municipality_id: optionsNumberSchema.required(requiredError).default(null),
  supplier_title: yup.string().default(null).nullable(),
  activity_id: optionsNumberSchema.default(null),
  date_of_payment: yup.date().required(requiredError),
  sss_invoice_receipt_date: yup.date().nullable(),
  date_of_invoice: yup.date().required(requiredError),
  receipt_date: yup.date().nullable(),
  description: yup.string().nullable(),
  date_of_start: yup.date().required(requiredError),
  vat_price: yup.number().nullable(),
  additionalExpenses: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().default(null),
        title: yup.string(),
        price: yup.number(),
        subject: optionsNumberSchema.default(null),
        bank_account: optionsStringSchema.required(requiredError),
        organization_unit_id: optionsNumberSchema.default(null),
        account: optionsNumberSchema.required(requiredError).default(null),
      }),
    )
    .nullable(),
});
