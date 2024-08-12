import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../../../types/dropdownData';
import {formatCurrency} from '../../../../utils/currencyUtils.ts';

export const depositTaxesTableHeads: TableHead[] = [
  {
    title: 'Subjekt',
    accessor: 'subject',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Trošak',
    accessor: 'title',
    type: 'text',
  },

  {
    title: 'Predmet',
    accessor: 'case_number',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: 'price',
    type: 'custom',
    renderContents: price => <Typography content={formatCurrency(price)} />,
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
];

export const DepositTaxStatusOptions = [
  {id: 'Plaćen', title: 'Plaćen'},
  {id: 'Na čekanju', title: 'Na čekanju'},
  {id: 'Kreiran', title: 'Kreiran'},
];
