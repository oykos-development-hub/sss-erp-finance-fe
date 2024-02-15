import {TableHead} from 'client-library';

export enum Tabs {
  FinesOverview = 1,
  AddFines = 2,
}
export const stockTabs = [
  {id: Tabs.FinesOverview, title: 'Pregled kazni', routeName: 'fines'},
  {id: Tabs.AddFines, title: 'Dodaj kaznu', routeName: 'add-fines'},
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

export const tableHeadsFinesOverview: TableHead[] = [
  {
    title: 'Subjekat',
    accessor: '',
    type: 'text',
  },
  {
    title: 'JMBG',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum izvršnosti',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Broj rešenja/presude',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Poziv na broj odobrenja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Visina kazne',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Sudski troškovi',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Naplaćeno',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: '',
    type: 'text',
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
