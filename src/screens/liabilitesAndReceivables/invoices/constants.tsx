import {TableHead} from 'client-library';
import StatusTableCell from '../../../shared/statusTableCell/statusTableCell.tsx';

export const invoicesOverviewTableHeads: TableHead[] = [
  {title: 'Broj', accessor: 'id'},
  {title: 'Dobavljač', accessor: 'supplier'},
  {title: 'Datum računa', accessor: 'date_of_invoice'},
  {title: 'Datum valute', accessor: 'date_of_currency'},
  {title: 'Broj računa', accessor: 'invoice_number'},
  {title: 'Neto iznos', accessor: 'value'},
  {title: 'PDV', accessor: 'pdv'},
  {title: 'Ukupan iznos', accessor: 'total'},
  {
    title: 'Status',
    accessor: 'status',
    type: 'custom',
    renderContents: (status: string) => <StatusTableCell status={status} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const invoiceEntryTableHeads: TableHead[] = [
  {title: 'Naziv stavke', accessor: 'name'},
  {title: 'Neto iznos', accessor: 'value'},
  {title: 'PDV', accessor: 'pdv'},
  {title: 'Ukupan iznos', accessor: 'total'},
  {title: 'Opis', accessor: 'description'},
  {title: 'Konto', accessor: 'account'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const invoiceAmountTableHeads: TableHead[] = [
  {title: 'Konto', accessor: 'account', width: '200px'},
  {title: 'Ukupan iznos', accessor: 'total'},
];
