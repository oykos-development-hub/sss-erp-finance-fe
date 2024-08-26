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
import useInsertProceduralCostPayment from '../../../../services/graphQL/proceduralCosts/proceduralCostsPayments/useInsertProceduralCostPayment.ts';
import useDeleteProceduralCostPayment from '../../../../services/graphQL/proceduralCosts/proceduralCostsPayments/useDeleteProceduralCostPayment.ts';
import {ProceduralCostDetails, ProceduralCostOverviewItem} from '../../../../types/graphQL/proceduralCosts.ts';
import {FinePaymentMethods} from '../../fines/constants.tsx';
import useGetProceduralCostPayments from '../../../../services/graphQL/proceduralCosts/proceduralCostsPayments/useGetProceduralCostPayments.ts';
import {checkActionRoutePermissions} from '../../../../services/checkRoutePermissions.ts';

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
  procedure_cost_id: yup.number().required(),
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
  procedural_cost: ProceduralCostOverviewItem;
  refetchProceduralCost: () => Promise<void>;
}
const PaymentDetails = ({procedural_cost, refetchProceduralCost}: PaymentFormProps) => {
  const proceduralCostDetails: ProceduralCostDetails = procedural_cost?.procedure_cost_details;
  const {payments, refetch} = useGetProceduralCostPayments(procedural_cost?.id);
  const {insertProceduralCostPayment} = useInsertProceduralCostPayment();
  const {deleteProceduralCostPayment} = useDeleteProceduralCostPayment();
  const {
    alert,
    contextMain: {permissions},
  } = useAppContext();

  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [showDeletePaymentModal, setShowDeletePaymentModal] = useState<number | null>(null);

  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/finance/fines-taxes/procedural-costs');

  const {
    control,
    register,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<PaymentEntryForm>({});

  const {fields, append, remove} = useFieldArray({name: 'payments', control});

  const isDisabled = !updatePermission || procedural_cost?.status.title === 'Plaćeno';

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
      procedure_cost_id: procedural_cost.id,
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
      !isDisabled && appendLastRow();
      return;
    }

    !isDisabled && appendLastRow();
  }, [payments]);

  const isRowDisabled = (row: any) => {
    if (isDisabled) return true;
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
      await insertProceduralCostPayment(
        payload,
        () => {
          refetch();
          refetchProceduralCost();
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
    await deleteProceduralCostPayment(
      showDeletePaymentModal,
      () => {
        remove(paymentIndex);
        refetchProceduralCost();
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
          <Controller
            name={`payments.${index}.amount`}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Input
                value={value.toString()}
                name={name}
                onChange={onChange}
                type="currency"
                leftContent={
                  <div style={{color: isRowDisabled(row) ? Theme.palette.gray300 : Theme.palette.gray800}}>€</div>
                }
                disabled={isRowDisabled(row)}
                error={errors?.payments?.[index]?.amount?.message}
              />
            )}
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
        <Typography variant="bodySmall" content={parseDate(procedural_cost?.payment_deadline_date)} />
      </Amount>
      <LabeledDivider>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="DETALJI PLAĆANJA:" />
      </LabeledDivider>
      <Table
        tableHeads={tableHeadsPayments}
        data={fields}
        tableActions={
          isDisabled
            ? []
            : [
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
              ]
        }
      />
      <FinePaymentDetailsWrapper>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="UKUPNO:" />
          <Typography
            variant="bodySmall"
            content={formatCurrency(
              proceduralCostDetails?.all_payments_amount + proceduralCostDetails?.court_costs_paid,
            )}
          />
        </Amount>
      </FinePaymentDetailsWrapper>
      <LabeledDivider>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREGLED PLAĆANJA:" />
      </LabeledDivider>
      <FinePaymentDetailsWrapper>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="IZREČENA KAZNA:" />
          <Typography variant="bodySmall" content={formatCurrency(procedural_cost?.amount)} />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="UPLAĆENA KAZNA:" />
          <Typography variant="bodySmall" content={formatCurrency(proceduralCostDetails?.all_payments_amount)} />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREOSTALO ZA UPLATU:" />
          <Typography variant="bodySmall" content={formatCurrency(proceduralCostDetails?.left_to_pay_amount)} />
        </Amount>
        <Amount style={{marginTop: 20}}>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="IZREČENI SUDSKI TROŠKOVI:" />
          <Typography variant="bodySmall" content={formatCurrency(procedural_cost?.court_costs)} />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="UPLAĆENI SUDSKI TROŠKOVI:" />
          <Typography variant="bodySmall" content={formatCurrency(proceduralCostDetails?.court_costs_paid)} />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREOSTALO ZA UPLATU:" />
          <Typography
            variant="bodySmall"
            content={formatCurrency(proceduralCostDetails?.court_costs_left_to_pay_amount)}
          />
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
