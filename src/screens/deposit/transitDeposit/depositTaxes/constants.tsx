import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../../../types/dropdownData';

export const depositTaxesTableHeads: TableHead[] = [
  {
    title: 'Naziv',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
  {
    title: 'Subjekt',
    accessor: 'subject',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Iznos',
    accessor: 'price',
    type: 'custom',
    renderContents: (value: number) => <Typography variant="bodyMedium" content={value ? value : 0} />,
  },
];

export const DepositTaxStatusOptions = [
  {id: 'Plaćen', title: 'Plaćen'},
  {id: 'Na čekanju', title: 'Na čekanju'},
  {id: 'Kreiran', title: 'Kreiran'},
];
