import {Modal, Table, TableHead, Theme, Typography, Button} from 'client-library';
import {useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import useAccountingEntryInsert from '../../services/graphQL/accounting/useAccountingEntryInsert';
import {parseDateForBackend} from '../../utils/dateUtils';
import {roundCurrency} from '../../utils/roundCurrency';
import {AccountingModalProps} from '../accountingModal/types';
import {ModalButtons} from '../accountingModal/styles';

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
  date: Date;
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
    accessor: '',
    type: 'custom',
    renderContents: (_, row) => {
      return (
        <Typography
          content={row?.enforced_payment?.id ? row.enforced_payment.title : row.payment_order.title}
          variant="bodySmall"
          style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
        />
      );
    },
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
        date: parseDateForBackend(item?.date),
      })),
    };

    accountingEntryInsert(
      payload,
      () => {
        alert.success('Uspješno ste izvršili knjiženje.');
        data?.items[0]?.enforced_payment?.id
          ? navigate('/finance/accounting/enforced-payments-overview')
          : navigate('/finance/accounting/payment-orders-overview');
      },
      () => alert.error('Došlo je do greške. Pokušajte kasnije.'),
    );

    return;
  };

  const buttonControls = (
    <ModalButtons>
      <Button content={'Otkaži'} onClick={onClose} variant="secondary" />
      <Button content={'Sačuvaj'} onClick={handleSubmit(onSubmit)} variant="primary" disabled={data?.id} />
    </ModalButtons>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={() => onClose()}
        customButtonsControls={buttonControls}
        rightButtonOnClick={handleSubmit(onSubmit)}
        content={<Table tableHeads={tableHeads} data={data?.items || []} style={{marginBottom: 22}} />}
        title="Pregled knjiženja"
      />
    </>
  );
};
