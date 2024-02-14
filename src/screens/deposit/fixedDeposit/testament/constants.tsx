import {TableHead} from 'client-library';

export enum Tabs {
  Overview = 1,
  NewEntry = 2,
}

export const stockTabs = [
  {id: Tabs.Overview, title: 'Pregled', routeName: 'finance'},
  {id: Tabs.NewEntry, title: 'Unos', routeName: 'new-testament-entry'},
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
    title: 'Testator',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Broj predmeta SI',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Broj predmeta RS',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
];
