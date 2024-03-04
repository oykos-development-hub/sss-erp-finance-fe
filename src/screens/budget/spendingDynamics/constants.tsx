import {TableHead} from 'client-library';

export enum Tabs {
  SpendingDynamics = 1,
  Requests = 2,
}

export const stockTabs = [
  {id: Tabs.SpendingDynamics, title: 'Pregled', routeName: 'spending-dynamics'},
  {id: Tabs.Requests, title: 'Zahtjevi', routeName: 'requests'},
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

export const tableHeadsRequests: TableHead[] = [
  {
    title: 'ID',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum zahtjeva',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Podnosilac zahtjeva',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
];
