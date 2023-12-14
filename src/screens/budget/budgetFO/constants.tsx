import {TableHead} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';

export const budgetRequestsFO: TableHead[] = [
  // TODO change accessors to correct ones
  {title: 'ID', accessor: 'id'},
  {title: 'Organizaciona jedinica', accessor: 'organizaciona-jedinica'},
  {title: 'Datum kreiranja', accessor: 'datum-kreiranja'},
  {title: 'Ukupno', accessor: 'ukupno'},
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
