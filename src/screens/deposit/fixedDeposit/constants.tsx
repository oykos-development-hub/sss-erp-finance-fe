import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const CONFISCATED_PROPERTY_TYPES_SETTINGS = 'confiscated_property_types';

export const tableHeads: TableHead[] = [
  {
    title: 'Subjekat',
    accessor: 'subject',
    type: 'text',
  },
  {
    title: 'Datum rješenja',
    accessor: 'date_of_case',
    type: 'custom',
    renderContents: (value: string) => <Typography variant="bodyMedium" content={parseDate(value)} />,
  },
  {
    title: 'Broj predmeta',
    accessor: 'case_number',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
