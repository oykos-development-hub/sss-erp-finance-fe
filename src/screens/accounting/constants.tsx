import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../utils/dateUtils';
import {TypesForReceivables} from '../liabilitesAndReceivables/receivables/constants';
import {roundCurrency} from '../../utils/roundCurrency';

export enum Tabs {
  CurrentAccounting = 1,
  CurrentAccountingOverview = 2,
}

export const tableHeads: TableHead[] = [
  {
    title: 'Subjekt',
    accessor: 'supplier',
    type: 'custom',
    renderContents: supplier => <Typography content={supplier.title} variant="bodySmall" />,
  },
  {
    title: 'Datum',
    accessor: 'date',
    type: 'custom',
    renderContents: (date: string) => <Typography content={parseDate(date)} variant="bodySmall" />,
  },
  {
    title: 'Vrsta obaveze',
    accessor: 'type',
    type: 'custom',
    renderContents: (_, row) => {
      const typeValue = TypesForReceivables.find(option => option.id === row.type);
      return <Typography content={typeValue ? typeValue?.title : ''} />;
    },
  },
  {
    title: 'Broj predmeta',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Za plaćanje',
    accessor: 'price',
    type: 'custom',
    renderContents: price => <Typography content={roundCurrency(price)} variant="bodySmall" />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsAccountingOverview: TableHead[] = [
  {
    title: 'Redni broj ',
    accessor: 'formated_id_of_entry',
    type: 'custom',
    renderContents: (formated_id_of_entry: string) => <Typography content={formated_id_of_entry} variant="bodySmall" />,
  },
  {
    title: 'Datum knjiženja',
    accessor: 'date_of_booking',
    type: 'custom',
    renderContents: (date_of_booking: string) => (
      <Typography content={parseDate(date_of_booking)} variant="bodySmall" />
    ),
  },
  {
    title: 'Duguje',
    accessor: 'debit_amount',
    type: 'custom',
    renderContents: debit_amount => <Typography content={roundCurrency(debit_amount)} variant="bodySmall" />,
  },
  {
    title: 'Potražuje',
    accessor: 'credit_amount',
    type: 'custom',
    renderContents: credit_amount => <Typography content={roundCurrency(credit_amount)} variant="bodySmall" />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsForAccountingPaymentOrders: TableHead[] = [
  {
    title: 'Subjekt',
    accessor: 'supplier',
    type: 'custom',
    renderContents: supplier => <Typography content={supplier.title} variant="bodySmall" />,
  },
  {
    title: 'Datum',
    accessor: 'date',
    type: 'custom',
    renderContents: (date: string) => <Typography content={parseDate(date)} variant="bodySmall" />,
  },
  {
    title: 'Broj predmeta',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Za plaćanje',
    accessor: 'price',
    type: 'custom',
    renderContents: price => <Typography content={roundCurrency(price)} variant="bodySmall" />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
