import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';

export const tableHeads: TableHead[] = [
  {
    title: 'Tip',
    accessor: 'title',
    type: 'custom',
    renderContents: title => <Typography content={title || ''} />,
  },
  {
    title: 'Vezani subjekt',
    accessor: 'subject',
    type: 'custom',
    renderContents: subject => <Typography content={subject?.title} />,
  },
  {
    title: 'Neto iznos',
    accessor: 'price',
    type: 'custom',
    renderContents: price => <Typography content={price ? price?.toFixed(2) : ''} />,
  },
  {
    title: 'Račun banke',
    accessor: 'bank_account',
    type: 'custom',
    renderContents: bank_account => <Typography content={bank_account} />,
  },
  {
    title: 'Konto',
    accessor: 'account',
    type: 'custom',
    renderContents: account => <Typography content={account?.title} />,
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
];
