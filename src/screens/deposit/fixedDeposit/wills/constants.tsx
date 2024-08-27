import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../../../types/dropdownData';

export enum Tabs {
  Overview = 1,
  NewEntry = 2,
}

export const stockTabs = [
  {id: Tabs.Overview, title: 'Pregled', routeName: 'overview'},
  {id: Tabs.NewEntry, title: 'Unos', routeName: 'add-new'},
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

export const willTableHeads: TableHead[] = [
  {
    title: 'Testator',
    accessor: 'subject',
    type: 'text',
  },
  {
    title: 'Broj predmeta SI',
    accessor: 'case_number_si',
    type: 'text',
  },
  {
    title: 'Broj predmeta RS',
    accessor: 'case_number_rs',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const willDispatchTableHeads: TableHead[] = [
  {
    title: 'Tip kretanja',
    accessor: 'dispatch_type',
    type: 'text',
  },
  {
    title: 'Sudija',
    accessor: 'judge',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Broj predmeta',
    accessor: 'case_number',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const willDispatchOptions = [
  {id: 'U radu', title: 'U radu'},
  {id: 'Depozit', title: 'Depozit'},
];

export const willStatusOptions = [
  {id: 'U toku', title: 'U toku'},
  {id: 'Depozit', title: 'Depozit'},
  {id: 'Zaključen', title: 'Zaključen'},
];

export type WillStatusType = 'U toku' | 'Depozit' | 'Zaključen';
