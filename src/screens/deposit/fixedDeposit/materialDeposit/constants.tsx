import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../../../types/dropdownData';
import {parseDate} from '../../../../utils/dateUtils';

export const materialDepositItemTableHeads: TableHead[] = [
  {
    title: 'Kategorija',
    accessor: 'category',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Vrsta',
    accessor: 'type',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Jedinica',
    accessor: 'unit',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Datum oduzimanja',
    accessor: 'date_of_confiscation',
    type: 'custom',
    renderContents: (value: string) => <Typography variant="bodyMedium" content={parseDate(value)} />,
  },
  {
    title: 'Sudija',
    accessor: 'judge',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const materialDispatchTableHeads: TableHead[] = [
  {
    title: 'Način vraćanja',
    accessor: 'action',
    type: 'text',
  },
  {
    title: 'Kategorija',
    accessor: 'category',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Vrsta',
    accessor: 'type',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Količina',
    accessor: 'amount',
    type: 'text',
  },
  {
    title: 'Datum akta',
    accessor: 'date_of_action',
    type: 'custom',
    renderContents: (value: string) => <Typography variant="bodyMedium" content={parseDate(value)} />,
  },
  {
    title: 'Sudija',
    accessor: 'judge',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Subjekt',
    accessor: 'subject',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
