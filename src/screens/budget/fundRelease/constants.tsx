import {TableHead, Typography} from 'client-library';
import {monthVarsSr} from '../spendingDynamics/constants';

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
    title: 'Vrijednost',
    accessor: 'value',
    type: 'text',
  },
  {
    title: '',
    type: 'tableActions',
    accessor: '',
  },
];
