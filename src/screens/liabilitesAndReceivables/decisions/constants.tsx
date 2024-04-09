import {TableHead} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';

export const decisionsOverviewTableHeads: TableHead[] = [
  // TODO change accessors to correct ones
  {title: 'Broj', accessor: 'broj'},
  {title: 'Subjekt', accessor: 'supplier_title'},
  {title: 'Datum rješenja', accessor: 'date_of_invoice'},
  {title: 'Datum valute', accessor: 'date_of_payment'},
  {title: 'Broj predmeta', accessor: 'broj-predmeta'},
  {title: 'Neto iznos', accessor: 'neto-iznos'},
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
