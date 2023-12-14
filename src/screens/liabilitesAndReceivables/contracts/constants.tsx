import {TableHead} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';

export const contractsOverviewTableHeads: TableHead[] = [
  // TODO change accessors to correct ones
  {title: 'Broj', accessor: 'broj'},
  {title: 'Subjekt', accessor: 'subjekt'},
  {title: 'Datum rješenja', accessor: 'datum-rješenja'},
  {title: 'Datum valute', accessor: 'datum-valute'},
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
