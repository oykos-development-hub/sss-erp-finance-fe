import {DropdownData} from '../../../../types/dropdownData';
import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../../utils/dateUtils';
import {DepositPaymentOrder} from '../../../../types/graphQL/depositPaymentOrders';
import {formatCurrency} from '../../../../utils/currencyUtils.ts';

export type DepositPaymentOrderStatusType = 'payed' | 'pending';

export const DepositPaymentOrderStatusOptions: DropdownData<string>[] = [
  {id: 'payed', title: 'Plaćen'},
  {id: 'pending', title: 'Na čekanju'},
];

export type DepositPaymentOrderType = 'tax' | 'case';

export const DepositPaymentOrderTypeOptions: DropdownData<DepositPaymentOrderType>[] = [
  {id: 'case', title: 'Plaćanje po predmetu'},
  {id: 'tax', title: 'Plaćanje poreza/prireza'},
];

export const depositPaymentOrderTableHeads: TableHead[] = [
  {
    title: 'Tip naloga',
    accessor: '',
    type: 'custom',
    renderContents: (_, row: DepositPaymentOrder) => {
      const type = row.additional_expenses.length > 0 ? 'Plaćanje po predmetu' : 'Plaćanje poreza/prireza';
      return <Typography variant="bodyMedium" content={type} />;
    },
  },
  {
    title: 'Ime subjekta',
    accessor: 'supplier',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Datum naloga',
    accessor: 'date_of_payment',
    type: 'custom',
    renderContents: (value: string) => <Typography variant="bodyMedium" content={parseDate(value)} />,
  },
  {
    title: 'Broj izvoda',
    accessor: 'id_of_statement',
    type: 'text',
  },
  {
    title: 'Broj predmeta',
    accessor: 'case_number',
    type: 'text',
  },
  {
    title: 'Iznos',
    accessor: 'net_amount',
    type: 'custom',
    renderContents: (value: number, row: DepositPaymentOrder) => {
      let amount = 0;
      const isTaxOrder = row.additional_expenses_for_paying.length > 0;

      if (isTaxOrder) {
        console.log('is tax order');
        amount = row.additional_expenses_for_paying.reduce((acc, curr) => acc + curr.price, 0);
      } else {
        amount = value;
      }
      return <Typography variant="bodyMedium" content={formatCurrency(amount)} style={{textAlign: 'right'}} />;
    },
  },
  {
    title: 'Žiro račun',
    accessor: 'bank_account',
    type: 'text',
  },
  {
    title: 'Status',
    accessor: 'status',
    type: 'text',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const additionalExpensesTableHeads: TableHead[] = [
  {
    title: 'Naziv',
    accessor: 'title',
    type: 'text',
  },
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: (value: DropdownData<number>) => <Typography variant="bodyMedium" content={value.title} />,
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
    renderContents: price => <Typography content={formatCurrency(price)} />,
  },
];
