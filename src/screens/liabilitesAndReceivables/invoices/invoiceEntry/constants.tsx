import * as yup from 'yup';
import {optionsBooleanSchema, optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';
import {requiredError} from '../../../../constants';

export const invoiceSchema = yup.object().shape({
  id: yup.number(),
  description: yup.string().nullable(),
  supplier_id: optionsNumberSchema.required(requiredError).default(null),
  order_id: yup.number(),
  invoice_number: yup.string().when('is_invoice', {
    is: (item: {id: boolean; title: string}) => item.id,
    then: schema => schema.required(requiredError).default(null),
  }),
  date_of_invoice: yup
    .date()
    .nullable()
    .when('is_invoice', {
      is: (item: {id: boolean; title: string}) => item.id,
      then: schema => schema.required(requiredError).default(null),
    }),
  receipt_date: yup.date().nullable(),
  sss_invoice_receipt_date: yup
    .date()
    .nullable()
    .when('is_invoice', {
      is: (item: {id: boolean; title: string}) => item.id,
      then: schema => schema.required(requiredError).default(null),
    }),
  pro_forma_invoice_number: yup.string().when('is_invoice', {
    is: (item: {id: boolean; title: string}) => !item.id,
    then: schema => schema.required(requiredError).default(null),
  }),
  pro_forma_invoice_date: yup
    .date()
    .nullable()
    .when('is_invoice', {
      is: (item: {id: boolean; title: string}) => !item.id,
      then: schema => schema.required(requiredError).default(null),
    }),
  sss_pro_forma_invoice_receipt_date: yup
    .date()
    .nullable()
    .when('is_invoice', {
      is: (item: {id: boolean; title: string}) => !item.id,
      then: schema => schema.required(requiredError).default(null),
    }),
  bank_account: optionsStringSchema.required(requiredError),
  date_of_payment: yup.date().nullable(),
  type_for_invoice: yup
    .object()
    .shape({
      id: yup.number(),
      title: yup.string(),
    })
    .required('Tip računa je obavezan.')
    .nullable(),
  is_invoice: optionsBooleanSchema.required(requiredError),
  invoice_type: optionsStringSchema.required(requiredError),
  file_id: yup.number().nullable(),
  organization_unit_id: yup.number(),
  passed_to_accounting: yup.boolean(),
  articles: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number(),
        description: yup.string(),
        title: yup.string().required('Naziv stavke je obavezan.'),
        net_price: yup.number().required('Neto iznos je obavezan.').moreThan(0, 'Neto iznos mora biti veći od 0.'),
        vat_price: yup.number(),
        amount: yup.number().required('Količina je obavezna.').moreThan(0, 'Količina mora biti veća od 0.'),
        vat_percentage: optionsNumberSchema.required('PDV stopa je obavezna.').default(null),
        account: optionsNumberSchema.required('Konto je obavezan.').default(null),
      }),
    )
    .nullable(),
});
