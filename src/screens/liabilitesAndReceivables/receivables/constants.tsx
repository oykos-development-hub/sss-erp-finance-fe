import {TableHead, Typography} from 'client-library';
import * as yup from 'yup';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {parseDate} from '../../../utils/dateUtils.ts';
import {optionsNumberSchema, optionsStringSchema} from '../../../utils/formSchemas.ts';
import {requiredError} from '../../../constants.ts';

export const receivablesStatusOptions = [
  {id: '', title: 'Svi statusi'},
  {id: 'Na čekanju', title: 'Na čekanju'},
  {id: 'Plaćen', title: 'Plaćen'},
];

export const tableHeads: TableHead[] = [
  {
    title: 'Dobavljač',
    accessor: 'supplier',
    type: 'custom',
    renderContents: supplier => <Typography content={supplier?.title || ''} />,
  },
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: organization_unit => <Typography content={organization_unit?.title || ''} />,
  },
  {
    title: 'ID naloga',
    accessor: 'id_of_statement',
    type: 'custom',
    renderContents: id_of_statement => <Typography content={id_of_statement || ''} />,
  },
  {
    title: 'Datum plaćanja',
    accessor: 'date_of_payment',
    type: 'custom',
    renderContents: date_of_payment => <Typography content={parseDate(date_of_payment)} />,
  },
  {
    title: 'Iznos',
    accessor: 'amount',
    type: 'custom',
    renderContents: amount => <Typography content={amount} />,
  },
  {
    title: 'SAP ID',
    accessor: 'sap_id',
    type: 'custom',
    renderContents: sap_id => <Typography content={sap_id} />,
  },
  {
    title: 'SAP Datum',
    accessor: 'date_of_sap',
    type: 'custom',
    renderContents: date_of_sap => <Typography content={parseDate(date_of_sap)} />,
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (_, row) => {
      const statusValue = receivablesStatusOptions.find(option => option.id === row.status);
      return <StatusTableCell status={statusValue ? statusValue?.title : ''} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const receivableSchema = yup.object().shape({
  id: yup.number(),
  organization_unit_id: optionsNumberSchema.default(null),
  supplier_id: optionsNumberSchema.default(null),
  id_of_statement: yup.string().default(null).required(requiredError),
  sap_id: yup.string().default(null).nullable(),
  date_of_payment: yup.date().required(requiredError).default(null),
  date_of_sap: yup.date().nullable(),
  description: yup.string().nullable(),
  type: optionsStringSchema.default(null),
  amount: yup
    .number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .required(requiredError),
  items: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().default(null),
        invoice_id: yup.number().nullable(),
        additional_expense_id: yup.number().nullable(),
        salary_additional_expense_id: yup.number().nullable(),
        status: yup.string(),
        total_price: yup.number(),
        remain_price: yup.number(),
        title: yup.string().default(null),
        type: yup.string(),
        account: optionsNumberSchema,
      }),
    )
    .nullable(),
});

export const TypesForReceivables = [
  {id: 'decisions', title: 'Rješenje'},
  {id: 'contracts', title: 'Ugovor'},
  {id: 'invoices', title: 'Račun'},
  {id: 'salaries', title: 'Zarade'},
];
