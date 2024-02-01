import {TableHead} from 'client-library';
import {DropdownData} from '../../types/dropdownData';
import StatusTableCell from '../../shared/statusTableCell/statusTableCell.tsx';

export const budgetOverviewTableHeads: TableHead[] = [
  {title: 'ID', accessor: 'id'},
  {title: 'Godina', accessor: 'year'},
  {title: 'Izvor', accessor: 'source'},
  {title: 'Tip budžeta', accessor: 'type'},
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const budgetYear: DropdownData<string>[] = [
  {id: '', title: 'Sve'},
  {id: '2023', title: '2023'},
  {id: '2024', title: '2024'},
  {id: '2025', title: '2025'},
];

export const budgetYearModal: DropdownData<string>[] = [
  {id: '2023', title: '2023'},
  {id: '2024', title: '2024'},
  {id: '2025', title: '2025'},
];

export const budgetType: DropdownData<string>[] = [
  {id: '', title: 'Sve'},
  {id: 'kapitalni', title: 'Kapitalni'},
  {id: 'tekuci', title: 'Tekući'},
];

export const budgetTypeModal: DropdownData<number>[] = [
  {id: 1, title: 'Kapitalni'},
  {id: 2, title: 'Tekući'},
];

export const budgetStatus: DropdownData<string>[] = [
  {id: '', title: 'Sve'},
  {id: 'kreiran', title: 'Kreiran'},
  {id: 'poslat', title: 'Poslat'},
  {id: 'u toku', title: 'U toku'},
  {id: 'zakljucen', title: 'Zaključen'},
];

export const budgetStatusModal: DropdownData<string>[] = [
  {id: 'kreiran', title: 'Kreiran'},
  {id: 'poslat', title: 'Poslat'},
  {id: 'u toku', title: 'U toku'},
  {id: 'zakljucen', title: 'Zaključen'},
];
