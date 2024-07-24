import {
  Typography,
  Table,
  TableHead,
  Dropdown,
  Input,
  Datepicker,
  EditIconTwo,
  Theme,
  TrashIcon,
  CheckIcon,
  CloseIcon,
} from 'client-library';
import {Amount, FinePaymentDetailsWrapper, LabeledDivider} from './styles.ts';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {useEffect, useState} from 'react';
import {requiredError} from '../../../../constants.ts';
import {formatCurrency} from '../../../../utils/currencyUtils.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import {parseDate, parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import useInsertFlatRatePayment from '../../../../services/graphQL/flatRate/flatRatePayments/useInsertFlatRatePayment.ts';
import useDeleteFlatRatePayment from '../../../../services/graphQL/flatRate/flatRatePayments/useDeleteFlatRatePayment.ts';
import {FlatRateDetails, FlatRateOverviewItem} from '../../../../types/graphQL/flatRate.ts';
import {FinePaymentMethods} from '../../fines/constants.tsx';
import useGetFlatRatePayments from '../../../../services/graphQL/flatRate/flatRatePayments/useGetFlatRatePayments.ts';

const singlePaymentSchema = yup.object().shape({
  id: yup.number().required(requiredError),
  payment_method: yup.object().shape({
    id: yup.number().required(),
    title: yup.string().required(requiredError),
  }),
  amount: yup.number().required(requiredError).min(1, 'Iznos mora biti veći od 0'),
  payment_date: yup.date().required(requiredError),
  receipt_number: yup.string().required(requiredError),
  payment_reference_number: yup.string().required(requiredError),
  debit_reference_number: yup.string().required(requiredError),
  originalID: yup.number().required(requiredError),
  flat_rate_id: yup.number().required(),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
  status: yup.object().shape({
    id: yup.number().optional(),
    title: yup.string().optional(),
  }),
});

const paymentsSchema = yup.object().shape({
  payments: yup.array().of(singlePaymentSchema),
});

type PaymentEntryForm = yup.InferType<typeof paymentsSchema>;
type PaymentRow = yup.InferType<typeof singlePaymentSchema>;

interface PaymentFormProps {
  flat_rate: FlatRateOverviewItem;
  refetchFlatRate: () => Promise<void>;
}
const PaymentDetails = ({flat_rate, refetchFlatRate}: PaymentFormProps) => {
  const flatRateDetails: FlatRateDetails = flat_rate?.flat_rate_details;
  const {payments, refetch} = useGetFlatRatePayments(flat_rate?.id);
  const {insertFlatRatePayment} = useInsertFlatRatePayment();
  const {deleteFlatRatePayment} = useDeleteFlatRatePayment();
  const {alert} = useAppContext();

  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [showDeletePaymentModal, setShowDeletePaymentModal] = useState<number | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<PaymentEntryForm>({});

  const {fields, append, remove} = useFieldArray({name: 'payments', control});
  const appendLastRow = () =>
    append({
      id: 0,
      payment_method: {
        id: 0,
        title: '',
      },
      amount: 0,
      payment_date: new Date(),
      receipt_number: '',
      payment_reference_number: '',
      debit_reference_number: '',
      originalID: 0,
      flat_rate_id: flat_rate.id,
      status: {
        id: 0,
        title: '',
      },
    });

  useEffect(() => {
    remove();
    if (payments.length) {
      payments.forEach(payment => {
        append({
          ...payment,
          // need to save original id to be able to edit/delete the payment because useFieldArray will change it
          originalID: payment.id,
          payment_method: FinePaymentMethods.find(method => method.title === payment.payment_method.title) ?? {
            id: 0,
            title: '',
          },
          payment_date: new Date(payment?.payment_date),
        });
      });
      appendLastRow();
      return;
    }

    appendLastRow();
  }, [payments]);

  const isRowDisabled = (row: any) => {
    return editRowId ? editRowId !== row.originalID : !!row.originalID;
  };

  const validateSingleRow = async (rowData: PaymentRow, id: number) => {
    try {
      // Validate using Yup directly
      await singlePaymentSchema.validate(rowData, {abortEarly: false});
      return true; // Validation passed
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach(error => {
          setError(`payments.${id}.${error.path}` as never, {type: 'manual', message: error.message});
        });
      }
    }
  };

  const handleSubmitPayment = async (data: PaymentEntryForm) => {
    if (data.payments?.length) {
      const test = data.payments?.findIndex(item => item.originalID === editRowId);
      const selectedRow = test != -1 ? test : fields.length - 1;

      const isValid = await validateSingleRow(data?.payments[selectedRow], selectedRow);

      if (!isValid) return;

      const payment = data.payments![selectedRow];
      const {originalID, created_at, updated_at, status, ...updatedPayment} = payment;
      const parsedPaymentDate = parseDateForBackend(payment.payment_date);
      if (!parsedPaymentDate) return;

      const payload = {
        ...updatedPayment,
        payment_method: payment.payment_method.id,
        payment_date: parsedPaymentDate,
      };
      await insertFlatRatePayment(
        payload,
        () => {
          refetch();
          refetchFlatRate();
          alert.success('Uspješno sačuvano.');
          setEditRowId(null);
        },
        () => alert?.error('Greška. Promjene nisu sačuvane.'),
      );
    }
  };

  const handleDeletePayment = async () => {
    const paymentIndex = payments.findIndex(payment => payment.id === showDeletePaymentModal);
    if (!showDeletePaymentModal || paymentIndex === -1) return;
    await deleteFlatRatePayment(
      showDeletePaymentModal,
      () => {
        remove(paymentIndex);
        refetchFlatRate();
        alert.success('Uspješno obrisano.');
      },
      () => alert.error('Greška. Brisanje nije uspjelo.'),
    );
    setShowDeletePaymentModal(null);
  };

  const tableHeadsPayments: TableHead[] = [
    {
      title: 'Način plaćanja',
      accessor: 'payment_method',
      type: 'custom',
      renderContents: (_item, row, index) => {
        return (
          <Controller
            name={`payments.${index}.payment_method`}
            control={control}
            render={({field: {name, onChange, value}}) => (
              <Dropdown
                style={{width: '180px'}}
                name={name}
                onChange={onChange}
                value={value ?? FinePaymentMethods.find(method => method.title === value)}
                options={FinePaymentMethods}
                isDisabled={isRowDisabled(row)}
                error={isRowDisabled(row) ? '' : errors?.payments?.[index]?.payment_method?.title?.message}
              />
            )}
          />
        );
      },
    },
    {
      title: 'Iznos',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_item, row, index) => {
        return (
          <Input
            {...register(`payments.${index}.amount`)}
            type="number"
            leftContent={
              <div style={{color: isRowDisabled(row) ? Theme.palette.gray300 : Theme.palette.gray800}}>€</div>
            }
            disabled={isRowDisabled(row)}
            error={errors?.payments?.[index]?.amount?.message}
          />
        );
      },
    },
    {
      title: 'Datum uplate',
      accessor: 'payment_date',
      type: 'custom',
      renderContents: (_item, row, index) => {
        return (
          <Controller
            name={`payments.${index}.payment_date`}
            control={control}
            render={({field: {name, onChange, value}}) => (
              <Datepicker
                name={name}
                onChange={onChange}
                selected={value ? new Date(value) : ''}
                disabled={isRowDisabled(row)}
                error={errors?.payments?.[index]?.payment_date?.message}
                popperProps={{
                  strategy: 'fixed', // fixes datepicker going behind other elements
                  placement: 'top',
                }}
              />
            )}
          />
        );
      },
    },
    {
      title: 'Broj izvoda',
      accessor: 'receipt_number',
      type: 'custom',
      renderContents: (_item, row, index) => {
        return (
          <Input
            {...register(`payments.${index}.receipt_number`)}
            disabled={isRowDisabled(row)}
            error={errors?.payments?.[index]?.receipt_number?.message}
            key={`payments.${index}.receipt_number`}
          />
        );
      },
    },
    {
      title: 'Poziv na broj odobrenja',
      accessor: 'payment_reference_number',
      type: 'custom',
      renderContents: (_item, row, index) => {
        return (
          <Input
            {...register(`payments.${index}.payment_reference_number`)}
            disabled={isRowDisabled(row)}
            error={errors?.payments?.[index]?.payment_reference_number?.message}
          />
        );
      },
    },
    {
      title: 'Poziv na broj zaduženja',
      accessor: 'debit_reference_number',
      type: 'custom',
      renderContents: (_item, row, index) => {
        return (
          <Input
            {...register(`payments.${index}.debit_reference_number`)}
            disabled={isRowDisabled(row)}
            error={errors?.payments?.[index]?.debit_reference_number?.message}
          />
        );
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  return (
    <>
      <Amount style={{marginTop: 10}}>
        <Typography style={{fontWeight: 600, marginBottom: 10}} variant={'bodySmall'} content={'Platiti do:'} />
        <Typography variant="bodySmall" content={parseDate(flat_rate?.payment_deadline_date)} />
      </Amount>
      <LabeledDivider>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="DETALJI PLAĆANJA:" />
      </LabeledDivider>
      <Table
        tableHeads={tableHeadsPayments}
        data={fields}
        tableActions={[
          {
            name: 'Otkaži',
            onClick: () => setEditRowId(null),
            icon: <CloseIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => !isRowDisabled(row) && !!row.originalID,
          },
          {
            name: 'Plati',

            onClick: handleSubmit(handleSubmitPayment),
            icon: <CheckIcon stroke={Theme?.palette?.gray800} width={'20px'} height={'20px'} />,
            shouldRender: row => !isRowDisabled(row) || !row.originalID,
          },
          {
            name: 'Izmijeni',
            onClick: row => setEditRowId(row.originalID),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: row => isRowDisabled(row) && !!row.originalID,
          },
          {
            name: 'Izbriši',
            onClick: row => setShowDeletePaymentModal(row.originalID),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: row => !!row.originalID && (!editRowId || editRowId !== row.originalID),
          },
        ]}
      />
      <FinePaymentDetailsWrapper>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="UKUPNO:" />
          <Typography
            variant="bodySmall"
            content={formatCurrency(flatRateDetails?.all_payments_amount + flatRateDetails?.court_costs_paid)}
          />
        </Amount>
      </FinePaymentDetailsWrapper>
      <LabeledDivider>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREGLED PLAĆANJA:" />
      </LabeledDivider>
      <FinePaymentDetailsWrapper>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="IZREČENA KAZNA:" />
          <Typography variant="bodySmall" content={formatCurrency(flat_rate?.amount)} />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="UPLAĆENA KAZNA:" />
          <Typography variant="bodySmall" content={formatCurrency(flatRateDetails?.all_payments_amount)} />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="UMANJENJE KAZNE:" />
          <Typography
            variant="bodySmall"
            content={
              flatRateDetails?.amount_grace_period_available
                ? formatCurrency(flat_rate?.amount - flatRateDetails?.amount_grace_period)
                : '0.00 €'
            }
          />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREOSTALO ZA UPLATU:" />
          <Typography variant="bodySmall" content={formatCurrency(flatRateDetails?.left_to_pay_amount)} />
        </Amount>
        <Amount style={{marginTop: 20}}>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="IZREČENI SUDSKI TROŠKOVI:" />
          <Typography variant="bodySmall" content={formatCurrency(flat_rate?.court_costs)} />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="UPLAĆENI SUDSKI TROŠKOVI:" />
          <Typography variant="bodySmall" content={formatCurrency(flatRateDetails?.court_costs_paid)} />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREOSTALO ZA UPLATU:" />
          <Typography variant="bodySmall" content={formatCurrency(flatRateDetails?.court_costs_left_to_pay_amount)} />
        </Amount>
      </FinePaymentDetailsWrapper>
      <ConfirmationModal
        open={!!showDeletePaymentModal}
        subTitle={'Ova uplata će biti trajno izbrisana iz sistema.'}
        onClose={() => setShowDeletePaymentModal(null)}
        onConfirm={() => handleDeletePayment()}
      />
    </>
  );
};

export default PaymentDetails;
