import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../../../types/dropdownData';
import {parseDate} from '../../../../utils/dateUtils';

export type PaymentStatusType = 'Prelazni račun' | 'Glavni račun';

export const DepositPaymentStatusOptions = [
  {id: 'Prelazni račun', title: 'Prelazni račun'},
  {id: 'Glavni račun', title: 'Glavni račun'},
];

export const depositPaymentTableHeads: TableHead[] = [
  {
    title: 'Uplatilac',
    accessor: 'payer',
    type: 'text',
  },
  {
    title: 'Datum izvoda',
    accessor: 'date_of_bank_statement',
    type: 'custom',
    renderContents: (value: string) => <Typography variant="bodyMedium" content={parseDate(value)} />,
  },
  {
    title: 'Broj izvoda',
    accessor: 'number_of_bank_statement',
    type: 'text',
  },
  {
    title: 'Konto',
    accessor: 'account_id',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Broj predmeta',
    accessor: 'case_number',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
