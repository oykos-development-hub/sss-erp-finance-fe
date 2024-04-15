import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {parseDate} from '../../../utils/dateUtils.ts';

export const decisionsOverviewTableHeads: TableHead[] = [
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
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const SourceOfFunding = [
  {id: 'Budžet', title: 'Budžet'},
  {id: 'Budžetska rezerva', title: 'Budžetska rezerva'},
  {id: 'Donacija', title: 'Donacija'},
];
