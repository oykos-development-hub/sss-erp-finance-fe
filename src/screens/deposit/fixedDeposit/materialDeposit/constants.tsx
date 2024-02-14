import {TableHead} from 'client-library';

export enum Tabs {
  Overview = 1,
  NewEntry = 2,
}

export const stockTabs = [
  {id: Tabs.Overview, title: 'Pregled', routeName: 'material'},
  {id: Tabs.NewEntry, title: 'Unos', routeName: 'new-material-entry'},
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
    title: 'ID',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Subjekat',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Sudija',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum rješenja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Broj predmeta',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
];

export const newMaterialEntrytableHeads: TableHead[] = [
  {
    title: 'Kategorija',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Serijski broj',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Jedinica',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Količina',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Vraćena količina',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum akta',
    accessor: '',
    type: 'text',
  },
];
