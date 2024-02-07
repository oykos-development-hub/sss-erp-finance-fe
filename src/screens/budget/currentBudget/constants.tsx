import {TableHead} from 'client-library';

export enum Tabs {
  CurrentBudget = 1,
  Requests = 2,
}

export const stockTabs = [
  {id: Tabs.CurrentBudget, title: 'Pregled', routeName: 'current'},
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
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'text',
  },
  {
    title: 'Godina',
    accessor: 'year',
    type: 'text',
  },
  {
    title: 'Naslov',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Datum kreiranja',
    accessor: 'date_of_publishing',
    type: 'text',
  },
  {
    title: 'Ukupna vrijednost',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Posljednja izmjena',
    accessor: 'updated_at',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
];
