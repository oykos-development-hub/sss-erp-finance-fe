import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../types/dropdownData';
import StatusTableCell from '../../shared/statusTableCell/statusTableCell.tsx';

export const budgetOverviewTableHeads: TableHead[] = [
  {title: 'ID', accessor: 'id'},
  {title: 'Godina', accessor: 'year'},
  {
    title: 'Tip budžeta',
    accessor: 'budget_type',
    type: 'custom',
    renderContents: item => (item === 2 ? <Typography content="Tekući" /> : <Typography content="Kapitalni" />),
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
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
