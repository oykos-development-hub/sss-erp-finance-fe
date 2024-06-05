import {TableHead} from 'client-library';

export const fundReleaseTableHeads: TableHead[] = [
  {
    title: 'ID',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Datum zahtjeva',
    accessor: '',
    type: 'text',
  },
  {
    title: 'Podnosilac zahtjeva',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
];
