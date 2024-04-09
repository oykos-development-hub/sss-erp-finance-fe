import {TableHead, Typography} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';
import {DropdownData} from '../../../types/dropdownData.ts';
import {parseDate} from '../../../utils/dateUtils.ts';

export const invoicesOverviewTableHeads: TableHead[] = [
  {title: 'Broj', accessor: 'id', type: 'text'},
  {
    title: 'Dobavljač',
    accessor: 'supplier',
    type: 'custom',
    renderContents: (supplier: DropdownData<number>) => <Typography content={supplier?.title} />,
  },
  {
    title: 'Datum računa',
    accessor: 'date_of_invoice',
    type: 'custom',
    renderContents: (date_of_invoice: Date) => <Typography content={parseDate(date_of_invoice)} />,
  },
  {
    title: 'Datum valute',
    accessor: 'date_of_payment',
    type: 'custom',
    renderContents: (date_of_payment: Date) => <Typography content={parseDate(date_of_payment)} />,
  },
  {
    title: 'Broj računa',
    accessor: 'invoice_number',
    type: 'custom',
    renderContents: (invoice_number: string) => <Typography content={invoice_number} />,
  },
  {
    title: 'Neto iznos',
    accessor: 'net_price',
    type: 'custom',
    renderContents: net_price => {
      return <Typography content={net_price ? net_price?.toFixed(2) : '0.00'} />;
    },
  },
  {
    title: 'PDV',
    accessor: 'vat_price',
    type: 'custom',
    renderContents: vat_price => {
      return <Typography content={vat_price ? vat_price?.toFixed(2) : '0.00'} />;
    },
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
      const statusValue = StatusOptions.find(option => option.id === row.status);
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

export const StatusOptions = [
  {id: '', title: 'Svi statusi'},
  {id: 'waiting', title: 'Čeka na nalog za plaćanje'},
  {id: 'created', title: 'Kreiran nalog za plaćanje'},
  {id: 'payed', title: 'Plaćen'},
];

export const pdvOptions: DropdownData<number>[] = [
  {id: 0, title: '0 %'},
  {id: 7, title: '7 %'},
  {id: 21, title: '21 %'},
];
