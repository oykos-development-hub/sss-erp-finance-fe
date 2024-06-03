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

export const activityGoalsTableHeads: TableHead[] = [
  {title: 'Naziv cilja', accessor: 'title'},
  {title: 'Opis', accessor: 'description'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const goalIndicatorsTableHeads: TableHead[] = [
  {title: 'Kod indikatora učinka', accessor: 'performance_indicator_code'},
  {title: 'Planirana vrijednost u N+1 godini', accessor: 'planned_value_1'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
