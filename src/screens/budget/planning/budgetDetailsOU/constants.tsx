import {TableHead} from 'client-library';
import StatusTableCell from '../../../../shared/statusTableCell/statusTableCell';

export const budgetSummaryTableHeads: TableHead[] = [
  {title: 'Step', accessor: 'step'},
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
];
