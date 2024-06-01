import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';
import {months} from '../../../shared/budgetTable/constants';

export enum Tabs {
  SpendingDynamics = 1,
  Requests = 2,
}

export const stockTabs = [
  {id: Tabs.SpendingDynamics, title: 'Trenutna dinamika', routeName: 'spending-dynamics'},
  {id: Tabs.Requests, title: 'Istorija dinamike', routeName: 'requests'},
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

export const budgetDynamicHistoryTHeads: TableHead[] = [
  {
    title: 'Datum kreiranja',
    accessor: 'created_at',
    type: 'custom',
    renderContents: (data: string) => <Typography content={parseDate(data)} variant="bodyMedium" />,
  },
  {
    title: 'Podnosilac zahtjeva',
    accessor: 'username',
    type: 'text',
  },
];

export type MonthType =
  | 'january'
  | 'february'
  | 'march'
  | 'april'
  | 'may'
  | 'june'
  | 'july'
  | 'august'
  | 'september'
  | 'october'
  | 'november'
  | 'december';

export const monthVars: MonthType[] = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export const dynamicTableHeads = [
  {name: 'Konto', width: 10},
  ...months.map(month => ({name: month, width: 4})),
  {name: 'Ukupan ostatak', width: 10},
  {name: 'Ukupno', width: 10},
];

export const dynamicPreviewTableHeads = [
  {name: 'Konto', width: 20},
  ...months.map(month => ({name: month, width: 5.5})),
  {name: 'Ukupan ostatak', width: 5.5},
  {name: 'Ukupno', width: 5.5},
];
