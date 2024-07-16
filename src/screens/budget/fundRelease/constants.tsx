import {TableHead, Typography} from 'client-library';
import {monthVarsSr} from '../spendingDynamics/constants';
import {ExtendedTab} from '../../../constants.ts';
import {DropdownData} from '../../../types/dropdownData.ts';

export const fundReleaseTableHeads: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'year',
    type: 'text',
  },
  {
    title: 'Mjesec',
    accessor: 'month',
    type: 'custom',
    renderContents: (item: number) => <Typography content={monthVarsSr[item - 1]} variant="bodyMedium" />,
  },
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Vrijednost',
    accessor: 'value',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
  {
    title: '',
    type: 'tableActions',
    accessor: '',
  },
];

export enum Tabs {
  OverviewScreen = 1,
  RequestsScreen = 2,
}

export const fundReleaseTabs = (disabledRequests?: boolean): ExtendedTab[] => {
  return [
    {id: 1, title: 'Otpuštanje sredstava', routeName: '', disabled: false},
    {id: 2, title: 'Zahtjevi', routeName: 'requests', disabled: disabledRequests},
  ];
};

export const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return fundReleaseTabs().find(tab => tab.routeName === name)?.id;
};

export const getRouteName = (tabName: string) => {
  const tabIndex = fundReleaseTabs().findIndex(tab => tab.title === tabName);
  return fundReleaseTabs()[tabIndex].routeName;
};

export enum FundReleaseStatus {
  Created = 'Kreiran',
  Accepted = 'Prihvaćen',
  Filled = 'Popunjen',
}
