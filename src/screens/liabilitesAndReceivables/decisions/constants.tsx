import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {parseDate} from '../../../utils/dateUtils.ts';
import {StatusOptions} from '../../../constants.ts';
import {formatCurrency} from '../../../utils/currencyUtils.ts';

export enum Tabs {
  DecisionOverview = 1,
  AddDecision = 2,
}

export const decisionTabs = [
  {id: Tabs.DecisionOverview, title: 'Pregled rješenja', routeName: 'decisions'},
  {id: Tabs.AddDecision, title: 'Unos rješenja', routeName: 'add-decision'},
];

export const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return decisionTabs.find(tab => tab.routeName === name)?.id;
};

export const getRouteName = (tabName: string) => {
  const tabIndex = decisionTabs.findIndex(tab => tab.title === tabName);
  return decisionTabs[tabIndex].routeName;
};

export const decisionsOverviewTableHeads: TableHead[] = [
  {
    title: 'Subjekt',
    accessor: 'supplier',
    type: 'custom',
    renderContents: supplier => <Typography content={supplier?.title || ''} />,
  },
  {
    title: 'Datum rješenja',
    accessor: 'date_of_invoice',
    type: 'custom',
    renderContents: date_of_invoice => <Typography content={parseDate(date_of_invoice)} />,
  },
  {
    title: 'Datum valute',
    accessor: 'date_of_payment',
    type: 'custom',
    renderContents: date_of_payment => <Typography content={parseDate(date_of_payment)} />,
  },
  {title: 'Broj predmeta/djelovodni broj', accessor: 'invoice_number'},
  {
    title: 'Neto iznos',
    accessor: 'net_price',
    type: 'custom',
    renderContents: net_price => <Typography content={formatCurrency(net_price)} />,
  },
  {
    title: 'Bruto iznos',
    accessor: '',
    type: 'custom',
    renderContents: (_, row) => {
      const brutoPrice = row?.net_price + row?.vat_price;
      return <Typography content={formatCurrency(brutoPrice)} />;
    },
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (_, row) => {
      const statusValue = StatusOptions.find(option => option.id === row.status);
      return <StatusTableCell status={statusValue ? statusValue?.title : ''} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const SourceOfFunding = [
  {id: 'Budžet', title: 'Budžet'},
  {id: 'Budžetska rezerva', title: 'Budžetska rezerva'},
  {id: 'Donacija', title: 'Donacija'},
];
