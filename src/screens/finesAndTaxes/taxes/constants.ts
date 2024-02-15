import {TableHead} from 'client-library';

export enum Tabs {
  TaxesOverview = 1,
  AddTaxes = 2,
}
export const stockTabs = [
  {id: Tabs.TaxesOverview, title: 'Pregled taksi', routeName: 'taxes'},
  {id: Tabs.AddTaxes, title: 'Dodaj taksu', routeName: 'add-taxes'},
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

export const tableHeadsTaxesOverview: TableHead[] = [
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
    title: 'Konto',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Poziv na broj odobrenja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Visina takse',
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

export const tableHeadsAddTaxes: TableHead[] = [
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
