import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../../types/dropdownData.ts';
import {parseDate} from '../../../utils/dateUtils.ts';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {formatCurrency} from '../../../utils/roundCurrency.ts';

export enum Tabs {
  SentBudget = 1,
  Requests = 2,
}

export const stockTabs = [
  {id: Tabs.SentBudget, title: 'Pregled', routeName: 'details'},
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
    accessor: 'unit',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Datum',
    accessor: 'receive_date',
    type: 'custom',
    renderContents: (date: string) => <Typography content={parseDate(date)} variant="bodySmall" />,
  },
  {
    title: 'Ukupan iznos',
    accessor: 'total',
    type: 'custom',
    renderContents: (ammount: string) => (
      <Typography content={ammount !== '0' ? formatCurrency(ammount) : ''} variant="bodySmall" />
    ),
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
