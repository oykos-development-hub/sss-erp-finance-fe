import {Modal, Table, TableHead, Typography, Theme, Button} from 'client-library';
import {AccountingModalProps} from './types';
import {formatCurrency} from '../../utils/currencyUtils.ts';
import {TypesForReceivables} from '../../screens/liabilitesAndReceivables/receivables/constants';
import useAccountingEntryInsert from '../../services/graphQL/accounting/useAccountingEntryInsert';
import useAppContext from '../../context/useAppContext';
import {useForm} from 'react-hook-form';
import {parseDateForBackend} from '../../utils/dateUtils';
import {ModalButtons} from './styles';

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
  date: Date;
  title: string;
  type: string;
  supplier_id: number;
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
        content={formatCurrency(debit_amount)}
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
        content={formatCurrency(credit_amount)}
        variant="bodySmall"
        style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
      />
    ),
  },
  {
    title: 'Vrsta obaveze',
    accessor: 'type',
    type: 'custom',
    renderContents: (_, row) => {
      const typeValue = TypesForReceivables.find(option => option.id === row.type);
      return (
        <Typography
          content={typeValue ? typeValue?.title : ''}
          style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
        />
      );
    },
  },
  {
    title: 'Broj predmeta',
    accessor: '',
    type: 'custom',
    renderContents: (_, row) => (
      <Typography
        content={row.invoice?.id ? row.invoice.title : row.salary?.id ? row.salary.title : ''}
        variant="bodySmall"
        style={{color: row.debit_amount > 0 && row.debit_amount !== '' ? Theme.palette.black : Theme.palette.gray500}}
      />
    ),
  },
];

export const AccountingModal = ({open, onClose, data}: AccountingModalProps) => {
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
        date: parseDateForBackend(item?.date),
      })),
    };

    accountingEntryInsert(
      payload,
      () => {
        alert.success('Uspješno ste izvršili knjiženje.');
        navigate('/finance/accounting/obligations-overview');
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
        content={<Table tableHeads={tableHeads} data={data?.items || []} style={{marginBottom: 22}} />}
        title="Pregled knjiženja"
      />
    </>
  );
};
