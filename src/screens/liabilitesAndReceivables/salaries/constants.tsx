import {TableHead} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';

export const salariesOverviewTableHeads: TableHead[] = [
  // TODO change accessors to correct ones
  {title: 'Broj', accessor: 'broj'},
  {title: 'Aktivnost', accessor: 'aktivnost'},
  {title: 'Mjesec', accessor: 'mjesec'},
  {title: 'Datum obračuna', accessor: 'datum-obracuna'},
  {title: 'Neto iznos', accessor: 'neto-iznos'},
  {title: 'Ukupni bruto', accessor: 'ukupni-bruto'},
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
