import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../../../types/dropdownData';
import {parseDate} from '../../../../utils/dateUtils';

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

export const fixedMaterialDepositItemTableHeads: TableHead[] = [
  {
    title: 'Valuta',
    accessor: 'currency',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Datum oduzimanja',
    accessor: 'date_of_confiscation',
    type: 'custom',
    renderContents: (value: string) => <Typography variant="bodyMedium" content={parseDate(value)} />,
  },
  {
    title: 'Sudija',
    accessor: 'judge',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
