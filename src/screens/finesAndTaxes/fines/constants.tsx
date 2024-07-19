import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils.ts';
import {DropdownData} from '../../../types/dropdownData.ts';

export enum Tabs {
  FinesOverview = 1,
  AddFines = 2,
}

export const stockTabs = [
  {id: Tabs.FinesOverview, title: 'Pregled kazni', routeName: 'fines'},
  {id: Tabs.AddFines, title: 'Dodaj kaznu', routeName: 'add-new'},
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
    accessor: 'subject',
    type: 'text',
  },
  {
    title: 'Datum izvršnosti',
    accessor: 'execution_date',
    type: 'custom',
    renderContents: value => <Typography content={parseDate(value)} variant="bodyMedium" />,
  },
  {
    title: 'Broj rešenja/presude',
    accessor: 'decision_number',
    type: 'text',
  },
  {
    title: 'Visina kazne',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Sudski troškovi',
    accessor: 'court_costs',
    type: 'text',
  },
  {
    title: 'Naplaćeno',
    accessor: 'fine_fee_details',
    type: 'custom',
    renderContents: fine_fee_details => {
      return <Typography content={fine_fee_details?.fee_all_payments_amount} />;
    },
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: value => {
      return <Typography content={value?.title} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const defaultDropdownOption = {id: null, title: 'Sve'};
export const TypeOfFines: DropdownData<number>[] = [
  {id: 1, title: 'Rješenje'},
  {id: 2, title: 'Presuda'},
];

export const FinePaymentMethods: DropdownData<number>[] = [
  {id: 1, title: 'Uplata'},
  {id: 2, title: 'Prinudne naplate'},
  {id: 3, title: 'Sudski troškovi'},
];

export const FineStatuses: DropdownData<number>[] = [
  {id: 1, title: 'Uplaćeno'},
  {id: 2, title: 'Stornirano'},
  {id: 3, title: 'Povraćaj'},
];
