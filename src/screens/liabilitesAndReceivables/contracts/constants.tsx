import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {parseDate} from '../../../utils/dateUtils.ts';
import {ExtendedTab, StatusOptions} from '../../../constants.ts';

export enum Tabs {
  ContractOverview = 1,
  AddContract = 2,
}

export const contractTabs: ExtendedTab[] = [
  {id: Tabs.ContractOverview, title: 'Pregled ugovora', routeName: 'contracts', disabled: false},
  {id: Tabs.AddContract, title: 'Unos ugovora', routeName: 'add-contract', disabled: false},
];

export const getCurrentTab = (pathname: string) => {
  const path = pathname.split('/');
  const name = path[path.length - 1];
  return contractTabs.find(tab => tab.routeName === name)?.id;
};

export const getRouteName = (tabName: string) => {
  const tabIndex = contractTabs.findIndex(tab => tab.title === tabName);
  return contractTabs[tabIndex].routeName;
};

export const contractsOverviewTableHeads: TableHead[] = [
  {
    title: 'Subjekt',
    accessor: 'supplier',
    type: 'custom',
    renderContents: supplier => <Typography content={supplier?.title || ''} />,
  },
  {
    title: 'Datum rješenja',
    accessor: 'date_of_invoice',
    type: 'custom',
    renderContents: date_of_invoice => <Typography content={parseDate(date_of_invoice)} />,
  },
  {
    title: 'Datum valute',
    accessor: 'date_of_payment',
    type: 'custom',
    renderContents: date_of_payment => <Typography content={parseDate(date_of_payment)} />,
  },
  {title: 'Broj predmeta', accessor: 'invoice_number'},
  {
    title: 'Neto iznos',
    accessor: 'net_price',
    type: 'custom',
    renderContents: net_price => <Typography content={net_price ? net_price?.toFixed(2) : ''} />,
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (_, row) => {
      const statusValue = StatusOptions.find(option => option.id === row.status);
      return <StatusTableCell status={statusValue ? statusValue?.title : ''} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
