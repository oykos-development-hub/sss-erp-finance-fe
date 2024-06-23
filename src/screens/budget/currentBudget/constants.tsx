import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {parseDate} from '../../../utils/dateUtils.ts';
import {ReallocationItemDetail} from '../../../types/graphQL/externalReallocations.ts';

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
    title: 'Predlagač',
    accessor: 'destination_organization_unit',
    type: 'custom',
    renderContents: ou => <Typography content={ou.title} variant="bodySmall" />,
  },
  {
    title: 'Pošiljalac',
    accessor: 'source_organization_unit',
    type: 'custom',
    renderContents: ou => <Typography content={ou.title} variant="bodySmall" />,
  },
  {
    title: 'Datum kreiranja',
    accessor: 'date_of_request',
    type: 'custom',
    renderContents: (date: string) => <Typography content={parseDate(date)} variant="bodySmall" />,
  },
  {
    title: 'Ukupna vrijednost',
    accessor: 'items',
    type: 'custom',
    renderContents: (items: ReallocationItemDetail[]) => {
      const requestedAmountsSum = items.reduce((acc, item) => acc + parseInt(item.amount), 0) / 2;
      return <Typography content={requestedAmountsSum} variant="bodySmall" />;
    },
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
];
