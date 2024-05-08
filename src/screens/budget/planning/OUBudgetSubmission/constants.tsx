import {TableHead} from 'client-library';
import StatusTableCell from '../../../../shared/statusTableCell/statusTableCell';
import {DropdownData} from '../../../../types/dropdownData.ts';

export const budgetSummaryTableHeads: TableHead[] = [
  {title: 'Tip', accessor: 'type'},
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: DropdownData<string>) => <StatusTableCell status={status.title} />,
  },
];
