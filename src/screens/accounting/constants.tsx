import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../utils/dateUtils';
import {TypesForReceivables} from '../liabilitesAndReceivables/receivables/constants';
import {roundCurrency} from '../../utils/roundCurrency';

export enum Tabs {
  CurrentAccounting = 1,
  CurrentAccountingOverview = 2,
}

export const stockTabs = [
  {id: Tabs.CurrentAccounting, title: 'Knjiženje', routeName: 'accounting'},
  {id: Tabs.CurrentAccountingOverview, title: 'Glavna knjiga', routeName: 'accounting-overview'},
];

export const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return stockTabs.find(tab => tab.routeName === name)?.id;
};

export const getRouteName = (tabName: string) => {
  const tabIndex = stockTabs.findIndex(tab => tab.title === tabName);
  return stockTabs[tabIndex].routeName;
};

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
  {
    title: 'Saldo',
    accessor: '',
    type: 'custom',
    renderContents: (_, row) => <Typography content={row.debit_amount - row.credit_amount} variant="bodySmall" />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
