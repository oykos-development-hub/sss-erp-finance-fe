import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {DropdownData} from '../../../types/dropdownData.ts';
import {parseDate} from '../../../utils/dateUtils.ts';

export const invoicesOverviewTableHeads: TableHead[] = [
  {
    title: 'Dobavljač',
    accessor: 'supplier',
    type: 'custom',
    renderContents: (supplier: DropdownData<number>) => <Typography content={supplier?.title} />,
  },
  {
    title: 'Broj predračuna',
    accessor: 'pro_forma_invoice_number',
    type: 'custom',
    renderContents: (pro_forma_invoice_number: string) => <Typography content={pro_forma_invoice_number} />,
  },
  {
    title: 'Datum predračuna',
    accessor: 'pro_forma_invoice_date',
    type: 'custom',
    renderContents: (pro_forma_invoice_date: Date) => <Typography content={parseDate(pro_forma_invoice_date)} />,
  },
  {
    title: 'Broj računa',
    accessor: 'invoice_number',
    type: 'custom',
    renderContents: (invoice_number: string) => <Typography content={invoice_number} />,
  },
  {
    title: 'Datum računa',
    accessor: 'date_of_invoice',
    type: 'custom',
    renderContents: (date_of_invoice: Date) => <Typography content={parseDate(date_of_invoice)} />,
  },
  {
    title: 'Ukupan iznos',
    accessor: '',
    type: 'custom',
    renderContents: (_, row) => {
      return <Typography content={(row.net_price + row.vat_price)?.toFixed(2)} />;
    },
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (_, row) => {
      const statusValue = StatusOptionsInvoice.find(option => option.id === row.status);
      return <StatusTableCell status={statusValue ? statusValue?.title : ''} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const invoiceAmountTableHeads: TableHead[] = [
  {
    title: 'Konto',
    accessor: 'account',
    width: '200px',
    type: 'custom',
    renderContents: account => {
      return <Typography content={account?.title} />;
    },
  },
  {title: 'Ukupan iznos', accessor: 'total'},
];

export const pdvOptions: DropdownData<number>[] = [
  {id: 0, title: '0 %'},
  {id: 7, title: '7 %'},
  {id: 21, title: '21 %'},
];

export const StatusOptionsInvoice = [
  {id: '', title: 'Svi statusi'},
  {id: 'Kreiran', title: 'Kreiran'},
  {id: 'Djelimično na nalogu', title: 'Djelimično na nalogu'},
  {id: 'Nepotpun', title: 'Nepotpun'},
];
