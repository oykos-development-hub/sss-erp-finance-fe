import {TableHead} from 'client-library';

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
