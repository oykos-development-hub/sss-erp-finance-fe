import {TableHead} from 'client-library';
import {parseDate} from '../../../utils/dateUtils.ts';
import {Typography} from '@oykos-development/devkit-react-ts-styled-components';

export enum Tabs {
  OverviewScreen = 1,
  AddScreen = 2,
}
export const stockTabs = [
  {id: Tabs.OverviewScreen, title: 'Pregled troškova postupka', routeName: 'procedural-costs'},
  {id: Tabs.AddScreen, title: 'Dodaj troškove postupka', routeName: 'add-procedural-costs'},
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

export const tableHeadsProceduralCostsOverview: TableHead[] = [
  {
    title: 'Subjekat',
    accessor: 'subject',
    type: 'text',
  },
  {
    title: 'Datum izvršnosti',
    accessor: 'execution_date',
    type: 'custom',
    renderContents: value => <Typography content={parseDate(value)} variant="bodyMedium" />,
  },
  {
    title: 'Broj rešenja/presude',
    accessor: 'decision_number',
    type: 'text',
  },
  {
    title: 'Visina kazne',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Sudski troškovi',
    accessor: 'court_costs',
    type: 'text',
  },
  {
    title: 'Naplaćeno',
    accessor: 'procedure_cost_details',
    type: 'custom',
    renderContents: procedure_cost_details => {
      return <Typography content={procedure_cost_details?.all_payments_amount} />;
    },
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: value => {
      return <Typography content={value?.title} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsAddFines: TableHead[] = [
  {
    title: 'Način plaćanja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum uplate',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Uplatiti do',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Broj izvoda',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Poziv na broj odobrenja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Poziv na broj zaduženja',
    accessor: '',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
