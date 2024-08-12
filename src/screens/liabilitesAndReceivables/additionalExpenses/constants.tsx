import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {TypesTitles} from '../enforcedPayments/constants.tsx';
import {formatCurrency} from '../../../utils/currencyUtils.ts';

export const tableHeads: TableHead[] = [
  {
    title: 'Tip',
    accessor: 'title',
    type: 'custom',
    renderContents: title => <Typography content={title || ''} />,
  },
  {
    title: 'Tip dokumenta',
    accessor: 'obligation_type',
    type: 'custom',
    renderContents: (_, row) => {
      const typeValue = TypesTitles.find(option => option.id === row.obligation_type);
      return <Typography content={typeValue ? typeValue?.title : ''} />;
    },
  },
  {
    title: 'Broj dokumenta',
    accessor: 'obligation_number',
    type: 'custom',
    renderContents: obligation_number => <Typography content={obligation_number || ''} />,
  },
  {
    title: 'Subjekt',
    accessor: 'obligation_supplier',
    type: 'custom',
    renderContents: obligation_supplier => <Typography content={obligation_supplier?.title || ''} />,
  },
  {
    title: 'Vezani subjekt',
    accessor: 'subject',
    type: 'custom',
    renderContents: subject => <Typography content={subject?.title} />,
  },
  {
    title: 'Iznos',
    accessor: 'price',
    type: 'custom',
    renderContents: price => <Typography content={formatCurrency(price)} />,
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
