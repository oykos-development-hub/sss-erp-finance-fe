import {Modal, Table, TableHead, Theme, Typography} from 'client-library';
import {useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useAccountingEntryInsert from '../../services/graphQL/accounting/useAccountingEntryInsert';
import {parseDateForBackend} from '../../utils/dateUtils';
import {roundCurrency} from '../../utils/roundCurrency';
import {AccountingModalProps} from '../accountingModal/types';

interface ItemType {
  account: {
    id: number;
    title: string;
  };
  credit_amount: number;
  debit_amount: number;
  enforced_payment: {
    id: number;
    title: string;
  };
  invoice: {
    id: number;
    title: string;
  };
  salary: {
    id: number;
    title: string;
  };
  title: string;
  type: string;
  supplier_id: number;
  payment_order: {
    id: number;
    title: string;
  };
}

const tableHeads: TableHead[] = [
  {
    title: 'Naziv',
    accessor: 'title',
    type: 'custom',
    renderContents: (title, row) => (
      <Typography
        content={title}
        variant="bodySmall"
        style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
      />
    ),
  },
  {
    title: 'Konto',
    accessor: 'account',
    type: 'custom',
    renderContents: (account, row) => (
      <Typography
        content={account?.title}
        variant="bodySmall"
        style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
      />
    ),
  },
  {
    title: 'Duguje',
    accessor: 'debit_amount',
    type: 'custom',
    renderContents: (debit_amount, row) => (
      <Typography
        content={roundCurrency(debit_amount)}
        variant="bodySmall"
        style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
      />
    ),
  },
  {
    title: 'Potražuje',
    accessor: 'credit_amount',
    type: 'custom',
    renderContents: (credit_amount, row) => (
      <Typography
        content={roundCurrency(credit_amount)}
        variant="bodySmall"
        style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
      />
    ),
  },
  {
    title: 'Broj predmeta',
    accessor: 'payment_order',
    type: 'custom',
    renderContents: (payment_order, row) => (
      <Typography
        content={payment_order.title}
        variant="bodySmall"
        style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
      />
    ),
  },
];

export const AccountingPaymentOrdersModal = ({open, onClose, data}: AccountingModalProps) => {
  const {
    alert,
    navigation: {navigate},
  } = useAppContext();

  const {handleSubmit} = useForm();

  const {accountingEntryInsert, loading} = useAccountingEntryInsert();

  const onSubmit = async () => {
    if (loading) return;

    const payload = {
      date_of_booking: parseDateForBackend(data?.date_of_booking),
      organization_unit_id: data?.organization_unit?.id,
      items: data?.items.map((item: ItemType) => ({
        account_id: item?.account?.id || null,
        credit_amount: item?.credit_amount || null,
        debit_amount: item?.debit_amount || null,
        enforced_payment_id: item?.enforced_payment?.id || null,
        invoice_id: item?.invoice?.id || null,
        salary_id: item?.salary?.id || null,
        title: item?.title,
        type: item?.type,
        supplier_id: item?.supplier_id,
        payment_order_id: item?.payment_order?.id || null,
      })),
    };

    accountingEntryInsert(
      payload,
      () => {
        alert.success('Uspješno ste izvršili knjiženje.');
        navigate('/finance/accounting/payment-orders-overview');
      },
      () => alert.error('Došlo je do greške. Pokušajte kasnije.'),
    );

    return;
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => onClose()}
        leftButtonText="Otkaži"
        rightButtonText="Sačuvaj"
        rightButtonOnClick={handleSubmit(onSubmit)}
        content={<Table tableHeads={tableHeads} data={data?.items || []} style={{marginBottom: 22}} />}
        title="Pregled knjiženja"
      />
    </>
  );
};
