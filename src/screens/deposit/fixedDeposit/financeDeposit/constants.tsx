import {TableHead, Typography} from 'client-library';
import {DropdownData} from '../../../../types/dropdownData';
import {parseDate} from '../../../../utils/dateUtils';
import {formatCurrency} from '../../../../utils/currencyUtils.ts';

export const fixedFinancialDepositItemTableHeads: TableHead[] = [
  {
    title: 'Valuta',
    accessor: 'currency',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: 'amount',
    type: 'custom',
    renderContents: (value: number) => <Typography variant="bodyMedium" content={formatCurrency(value)} />,
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

export const fixedDepositDispatchTableHeads: TableHead[] = [
  {
    title: 'Način vraćanja',
    accessor: 'action',
    type: 'text',
  },
  {
    title: 'Valuta',
    accessor: 'currency',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: 'amount',
    type: 'custom',
    renderContents: (value: number) => <Typography variant="bodyMedium" content={formatCurrency(value)} />,
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
