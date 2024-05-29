import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../../shared/statusTableCell/statusTableCell';
import {DropdownData} from '../../../../types/dropdownData';

export const budgetListTableHeads: TableHead[] = [
  {title: 'ID', accessor: 'id'},
  {title: 'Godina', accessor: 'year'},
  {
    title: 'Tip budžeta',
    accessor: 'budget_type',
    type: 'custom',
    renderContents: item =>
      parseInt(item) === 2 ? <Typography content="Tekući" /> : <Typography content="Kapitalni" />,
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: DropdownData<number>) => <StatusTableCell status={status.title} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const budgetTypeFilterOptions: DropdownData<number | null>[] = [
  {id: null, title: 'Sve'},
  {id: 1, title: 'Kapitalni'},
  {id: 2, title: 'Tekući'},
];

export const budgetTypeOptions: DropdownData<number>[] = [
  {id: 1, title: 'Kapitalni'},
  {id: 2, title: 'Tekući'},
];

export const budgetStatus: DropdownData<string>[] = [
  {id: '', title: 'Sve'},
  {id: 'Kreiran', title: 'Kreiran'},
  {id: 'Poslat', title: 'Poslat'},
  {id: 'U toku', title: 'U toku'},
  {id: 'Zakljucen', title: 'Zaključen'},
];

export const budgetStatusModal: DropdownData<string>[] = [
  {id: 'kreiran', title: 'Kreiran'},
  {id: 'poslat', title: 'Poslat'},
  {id: 'u toku', title: 'U toku'},
  {id: 'zakljucen', title: 'Zaključen'},
];
