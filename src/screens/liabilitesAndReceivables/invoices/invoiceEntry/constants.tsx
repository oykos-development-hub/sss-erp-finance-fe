import * as yup from 'yup';
import {optionsBooleanSchema, optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';
import {requiredError} from '../../../../constants';

export const invoiceSchema = yup.object().shape({
  id: yup.number(),
  invoice_number: yup.string(),
  pro_forma_invoice_number: yup.string(),
  description: yup.string().nullable(),
  supplier_id: optionsNumberSchema.required(requiredError).default(null),
  order_id: optionsNumberSchema,
  date_of_invoice: yup.date().nullable(),
  pro_forma_invoice_date: yup.date().nullable(),
  receipt_date: yup.date().nullable(),
  sss_invoice_receipt_date: yup.date().required('Datum prijema računa SSS je obavezan.'),
  bank_account: optionsStringSchema.required(requiredError).default(null),
  date_of_payment: yup.date().required('Datum valute je obavezan.'),
  type_for_invoice: yup
    .object()
    .shape({
      id: yup.number(),
      title: yup.string(),
    })
    .required('Tip računa je obavezan.')
    .nullable(),
  is_invoice: optionsBooleanSchema.required(requiredError).default(null),
  invoice_type: optionsStringSchema.required(requiredError).default(null),
  file_id: yup.number().nullable(),
  organization_unit_id: yup.number(),
  passed_to_accounting: yup.boolean(),
  passed_to_inventory: yup.boolean(),
  articles: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number(),
        description: yup.string(),
        title: yup.string().required('Naziv stavke je obavezan.'),
        net_price: yup.number().required('Neto iznos je obavezan.'),
        vat_price: yup.number(),
        amount: yup.number().required('Količina je obavezna.'),
        vat_percentage: yup
          .object({
            id: yup.number(),
            title: yup.string(),
          })
          .required('PDV stopa je obavezna.')
          .nullable(),
        account: yup
          .object({
            id: yup.number(),
            title: yup.string(),
          })
          .required('Konto je obavezan.')
          .nullable(),
      }),
    )
    .nullable(),
});
