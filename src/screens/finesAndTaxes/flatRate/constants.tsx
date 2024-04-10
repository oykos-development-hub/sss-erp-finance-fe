import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils.ts';

export enum Tabs {
  OverviewScreen = 1,
  AddScreen = 2,
}
export const stockTabs = [
  {id: Tabs.OverviewScreen, title: 'Pregled paušala', routeName: 'flat-rate'},
  {id: Tabs.AddScreen, title: 'Dodaj paušal', routeName: 'add-flat-rate'},
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

export const tableHeadsFlatRateOverview: TableHead[] = [
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
    accessor: 'flat_rate_details',
    type: 'custom',
    renderContents: flat_rate_details => {
      return <Typography content={flat_rate_details?.all_payments_amount} />;
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
