import {TableHead} from 'client-library';

export enum Tabs {
  CurrentAccounting = 1,
  CurrentAccountingOverview = 2,
}

export const stockTabs = [
  {id: Tabs.CurrentAccounting, title: 'Knjiženje', routeName: 'accounting'},
  {id: Tabs.CurrentAccountingOverview, title: 'Pregled knjiženja', routeName: 'accounting-overview'},
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
    title: 'Konto',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Subjekt',
    accessor: '',
    type: 'text',
  },
  {
    title: 'ID',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Vrsta obaveze',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Broj predmeta',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Za plaćanje',
    accessor: '',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsAccountingOverview: TableHead[] = [
  {
    title: 'ID',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Org. jedinica',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum kreiranja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum knjiženja',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Duguje',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Potražuje',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Saldo',
    accessor: '',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
