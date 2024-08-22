import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, FileUpload, Input, Table, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {v4 as uuidv4} from 'uuid';
import * as yup from 'yup';
import FileList from '../../../../components/fileList/fileList';
import {requiredError} from '../../../../constants';
import useAppContext from '../../../../context/useAppContext';
import useCalculateAdditionalExpenses from '../../../../services/graphQL/calculateAdditionalExpenses/useCalculateAdditionalExpenses';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers';
import useGetTaxAuthorityCodebook from '../../../../services/graphQL/taxAuthorityCodebook/useGetTaxAuthorityCodebookOverview';
import useGetCases from '../../../../services/graphQL/transitDeposits/useGetCases';
import useInsertDepositPaymentOrder from '../../../../services/graphQL/transitDeposits/useInsertDepositPaymentOrder';
import {FlexColumn, FlexRow} from '../../../../shared/flex';
import Footer from '../../../../shared/footer';
import {TableTitle} from '../../../../shared/tableTitle';
import {
  DepositPaymentOrder,
  DepositPaymentOrderCase,
  PaymentOrderAdditionalExpense,
} from '../../../../types/graphQL/depositPaymentOrders';
import {parseDateForBackend} from '../../../../utils/dateUtils';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';
import {additionalExpensesTableHeads} from './constants';
import PayOrderModal from './payOrderModal';
import {checkActionRoutePermissions} from '../../../../services/checkRoutePermissions.ts';

const MUNICIPALITY_ENTITY = 'municipalities';

type OrderByCaseNumberFormProps = {
  data?: DepositPaymentOrder;
  refetchPaymentOrder?: () => void;
};

const orderByCaseNumberSchema = yup.object().shape(
  {
    source_bank_account: optionsStringSchema.required(requiredError),
    case_number: optionsStringSchema.nullable().required(requiredError).default(null),
    //* Just for show.
    left_case_amount: yup.number().required(requiredError).nullable().default(null),
    //* Choose either gross or net amount to pay. The other should be disabled and vice-versa.
    net_amount_to_pay: yup.string().when('gross_amount_to_pay', {
      is: '',
      then: schema => schema.required(requiredError),
    }),
    gross_amount_to_pay: yup.string().when('net_amount_to_pay', {
      is: '',
      then: schema => schema.required(requiredError),
    }),
    //* Unfortunate naming. This is to be sent with the insertDepositPaymentOrder mutation.
    net_amount: yup.number().required(requiredError),
    id: yup.number().nullable().default(null),
    //* Unfortunate naming of the field. Should be subject_id.
    supplier_id: optionsNumberSchema.required(requiredError),
    bank_account: optionsStringSchema.required(requiredError),
    date_of_payment: yup.date().required(requiredError),
    date_of_statement: yup.date().nullable().default(null),
    id_of_statement: yup.string().nullable().default(null),
    municipality_id: optionsNumberSchema.required(requiredError),
    tax_authority_codebook_id: optionsNumberSchema.required(requiredError),
    file_id: yup.number().nullable().default(null),
    additional_expenses: yup
      .array()
      .of(
        yup.object().shape({
          price: yup.number().required(requiredError),
          title: yup.string().required(requiredError),
          subject_id: yup.number().required(requiredError),
          organization_unit_id: yup.number().required(requiredError),
          id: yup.string().required(requiredError),
        }),
      )
      .required(requiredError),
  },
  [['net_amount_to_pay', 'gross_amount_to_pay']],
);

type OrderByCaseNumberFormType = yup.InferType<typeof orderByCaseNumberSchema>;

const OrderByCaseNumberForm = ({data, refetchPaymentOrder}: OrderByCaseNumberFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();
  const [payModal, setPayModal] = useState(false);

  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {
      organization_unit: {id: organization_unit_id, bank_accounts: org_unit_bank_accounts, permissions},
    },
    fileService: {uploadFile},
    alert,
  } = useAppContext();

  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');

  const id = pathname.split('/').pop();
  const isNew = id === 'add-new';

  const {
    handleSubmit,
    register,
    formState: {errors},
    setValue,
    control,
    reset,
    watch,
    trigger,
  } = useForm<OrderByCaseNumberFormType>({
    resolver: yupResolver(orderByCaseNumberSchema),
  });

  const subject = watch('supplier_id');

  const {
    tax_authority_codebook_id,
    municipality_id,
    source_bank_account,
    net_amount_to_pay,
    gross_amount_to_pay,
    date_of_statement,
    id_of_statement,
    additional_expenses,
    left_case_amount,
  } = watch();

  const {insertDepositPaymentOrder, loading: isSaving} = useInsertDepositPaymentOrder();

  const {data: cases} = useGetCases(
    {organization_unit_id, bank_account: source_bank_account?.id},
    {
      transform: data =>
        data.map((item: DepositPaymentOrderCase) => ({
          id: item.case_number,
          title: item.case_number,
          amount: item.amount,
        })),
    },
  );

  const {suppliers: subjects} = useGetSuppliers({parent_id: null});

  const {suppliers: municipalities} = useGetSuppliers({entity: MUNICIPALITY_ENTITY});
  const {data: taxAuthorityCodebook} = useGetTaxAuthorityCodebook();

  const {calculateAdditionalExpenses, loading: isLoadingExpenses} = useCalculateAdditionalExpenses(
    {
      municipality_id: municipality_id?.id,
      tax_authority_codebook_id: tax_authority_codebook_id?.id,
      gross_price: gross_amount_to_pay ? parseInt(gross_amount_to_pay) : null,
      net_price: net_amount_to_pay ? parseInt(net_amount_to_pay) : null,
    },
    {
      onSuccess: data => {
        if (net_amount_to_pay) {
          setValue('gross_amount_to_pay', data ? data.reduce((acc, item) => acc + item.price, 0).toString() : '');
        } else {
          setValue('net_amount_to_pay', data?.length ? data[data.length - 1].price.toString() : '');
        }
        //* We need to adapt the data to the form field format.
        const additionalExpensesTransformed = data
          ? data.map(item => ({
              price: item.price,
              title: item.title,
              subject_id: item.subject.id,
              organization_unit_id,
              id: uuidv4(),
            }))
          : [];

        setValue('additional_expenses', additionalExpensesTransformed);
        setValue('net_amount', data?.length ? data[data.length - 1].price : 0);
      },
    },
  );

  const onSubmit = async (data: OrderByCaseNumberFormType) => {
    if (
      data.left_case_amount &&
      data.gross_amount_to_pay &&
      data.left_case_amount < parseInt(data.gross_amount_to_pay) &&
      isNew
    ) {
      alert.error('Iznos za plaćanje ne može biti veći od preostalog iznosa za plaćanje');
      return;
    }

    const payload = {
      case_number: data.case_number?.id,
      file_id: data.file_id ? data.file_id : null,
      id: data.id ? data.id : null,
      organization_unit_id,
      additional_expenses: data.additional_expenses.map((item: any) => {
        const {id, ...rest} = item;
        return rest;
      }),
      additional_expenses_for_paying: null,
      source_bank_account: source_bank_account?.id,
      municipality_id: municipality_id?.id,
      tax_authority_codebook_id: tax_authority_codebook_id?.id,
      supplier_id: subject.id,
      bank_account: data.bank_account.id,
      date_of_payment: parseDateForBackend(data.date_of_payment) as string,
    };

    if (uploadedFiles?.length) {
      const formData = new FormData();
      const fileArray = Array.from(uploadedFiles);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setUploadedFiles(undefined);
          payload.file_id = res[0]?.id;
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
          return;
        },
      );
    }

    await insertDepositPaymentOrder(
      payload,
      (data: DepositPaymentOrder) => {
        alert.success(isNew ? 'Uspješno ste dodali novi nalog za plaćanje' : 'Uspešno ste izmjenili nalog za plaćanje');
        if (isNew) {
          navigate(`/finance/deposit/transit/payment-orders/${data.id}`);
        } else {
          refetchPaymentOrder && refetchPaymentOrder();
        }
      },
      () => {
        alert.error(
          isNew ? 'Greška prilikom dodavanja novog naloga za plaćanje' : 'Greška prilikom izmjene naloga za plaćanje',
        );
      },
    );
  };

  const calculateExpenses = () => {
    //* Trigger validation for fields required for calculating additional expenses.
    trigger(['tax_authority_codebook_id', 'municipality_id', 'net_amount_to_pay', 'gross_amount_to_pay']);
    if (!tax_authority_codebook_id || !municipality_id || (!net_amount_to_pay && !gross_amount_to_pay)) return;

    //* We cannot send both net and gross amount to pay to calculate the additional expenses.
    if (net_amount_to_pay && gross_amount_to_pay) {
      alert.error('Izaberite samo jedan iznos za plaćanje');
      return;
    }

    calculateAdditionalExpenses();
  };

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  useEffect(() => {
    if (data) {
      const netAmountToPay =
        data.additional_expenses.find((item: PaymentOrderAdditionalExpense) => item.title === 'Neto')?.price || 0;

      reset({
        id: data.id,
        file_id: data.file.id,
        supplier_id: data.supplier,
        //todo: change later
        bank_account: {id: data.bank_account, title: data.bank_account},
        id_of_statement: data.id_of_statement,
        date_of_statement: data.date_of_payment ? new Date(data.date_of_payment) : null,
        date_of_payment: new Date(data.date_of_payment),
        case_number: {id: data.case_number, title: data.case_number},
        //* Colleague David said that this should be the net amount. It's always the last item in the additional expenses array.
        net_amount: netAmountToPay,
        net_amount_to_pay: netAmountToPay.toString(),
        gross_amount_to_pay: data.additional_expenses.reduce((acc, item) => acc + item.price, 0).toString(),
        source_bank_account: {id: data.source_bank_account, title: data.source_bank_account},
        additional_expenses: data.additional_expenses.map((item: PaymentOrderAdditionalExpense) => ({
          price: item.price,
          title: item.title,
          subject_id: item.subject.id,
          organization_unit_id,
          id: uuidv4(),
        })),
      });
    }
  }, [data]);

  useEffect(() => {
    if (data && municipalities.length && taxAuthorityCodebook.length) {
      setValue('municipality_id', municipalities.find(item => item.id === data.municipality?.id)!);
      setValue(
        'tax_authority_codebook_id',
        taxAuthorityCodebook.find(item => item.id === data.tax_authority_codebook?.id)!,
      );
    }
  }, [data, municipalities, taxAuthorityCodebook]);

  useEffect(() => {
    if (data && cases && !left_case_amount) {
      const value = cases.find(item => item.id === data.case_number)?.amount || 0;
      setValue('left_case_amount', value.toFixed(2));
    }
  }, [data, cases]);

  const onSourceBankAccountChange = () => {
    setValue('case_number', null as any);
    setValue('left_case_amount', null as any);
  };

  const bankAccountOptions = useMemo(() => {
    if (!subject) return [];

    const options = subjects.find(item => item.id === subject.id)?.bank_accounts.map(item => ({id: item, title: item}));
    return options ?? [];
  }, [subject]);

  const orgUnitBankAccountOptions = useMemo(() => {
    if (!org_unit_bank_accounts) return [];
    return org_unit_bank_accounts.map((item: string) => ({id: item, title: item}));
  }, [org_unit_bank_accounts]);

  //* If there is a date and id of statement, it means this has been payed, so everything should be disabled.
  //* When editing, everything is to be disabled except the file upload and the date of payment.
  const isDisabled = !updatePermittedRoutes || (!!date_of_statement && !!id_of_statement);

  return (
    <FlexColumn gap={20} align="stretch">
      <FlexRow gap={8}>
        <Controller
          name="source_bank_account"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              label="ŽIRO RAČUN:"
              name={name}
              value={value}
              onChange={value => {
                onSourceBankAccountChange();
                onChange(value);
              }}
              options={orgUnitBankAccountOptions}
              error={errors.source_bank_account?.message}
              isDisabled={isDisabled || !isNew}
              isRequired
            />
          )}
        />
        <Controller
          name="case_number"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              label="BROJ PREDMETA:"
              name={name}
              value={value}
              onChange={value => {
                onChange(value);
                setValue('left_case_amount', cases.find(item => item.id === value.id)?.amount || 0);
              }}
              options={cases}
              error={errors.case_number?.message}
              isDisabled={isDisabled || !isNew}
              isRequired
            />
          )}
        />
        {!data && (
          <Input
            label="IZNOS ZA PLAĆANJE:"
            value={left_case_amount ? left_case_amount.toString() : undefined}
            type={'currency'}
            disabled={true}
          />
        )}
      </FlexRow>
      <FlexRow gap={8}>
        <Controller
          name="supplier_id"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              label="SUBJEKT:"
              name={name}
              value={value}
              onChange={onChange}
              options={subjects}
              error={errors.supplier_id?.message}
              isDisabled={isDisabled || !isNew}
              isRequired
            />
          )}
        />
        <Controller
          name="bank_account"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              label="ŽIRO RAČUN SUBJEKTA:"
              name={name}
              value={value}
              onChange={onChange}
              options={bankAccountOptions}
              error={errors.bank_account?.message}
              isDisabled={!subject || isDisabled || !isNew}
              isRequired
            />
          )}
        />
      </FlexRow>
      <FlexRow gap={8}>
        <Controller
          name="municipality_id"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              label="OPŠTINA:"
              name={name}
              value={value}
              onChange={onChange}
              options={municipalities}
              error={errors.municipality_id?.message}
              isDisabled={isDisabled || !isNew}
              isRequired
            />
          )}
        />
        <Controller
          name="tax_authority_codebook_id"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              label="ŠIFARNIK PORESKE UPRAVE:"
              name={name}
              value={value}
              onChange={onChange}
              options={taxAuthorityCodebook}
              error={errors.tax_authority_codebook_id?.message}
              isDisabled={isDisabled || !isNew}
              isRequired
            />
          )}
        />
        <div style={{width: '100%'}}>
          <Controller
            name="date_of_payment"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : null}
                onChange={onChange}
                label="DATUM NALOGA"
                error={errors.date_of_payment?.message}
                disabled={isDisabled}
                isRequired
              />
            )}
          />
        </div>
      </FlexRow>
      <FlexRow gap={8}>
        <Input
          label="NETO IZNOS:"
          {...register('net_amount_to_pay')}
          error={errors.net_amount_to_pay?.message}
          disabled={Boolean(gross_amount_to_pay && !net_amount_to_pay) || isDisabled || !isNew}
          isRequired
        />
        <Input
          label="BRUTO IZNOS:"
          {...register('gross_amount_to_pay')}
          error={errors.gross_amount_to_pay?.message}
          disabled={Boolean(net_amount_to_pay && !gross_amount_to_pay) || isDisabled || !isNew}
          isRequired
        />
      </FlexRow>
      <div style={{marginBottom: 10}}>
        <FileUpload
          icon={null}
          files={uploadedFiles}
          variant="secondary"
          onUpload={handleUpload}
          note={<Typography variant="bodySmall" content="Dodaj fajl" />}
          buttonText="Učitaj"
          disabled={isDisabled}
        />
        <FileList files={data?.file?.id ? [data.file] : null} />
      </div>
      {isNew && (
        <Button content="Obračunaj" variant="primary" onClick={calculateExpenses} style={{width: 'fit-content'}} />
      )}

      {additional_expenses?.length > 0 && (
        <>
          <TableTitle style={{marginTop: 30}}>
            <Typography variant="bodyLarge" content="Dodatni troškovi" style={{fontWeight: 'bold'}} />
          </TableTitle>
          <Table
            tableHeads={additionalExpensesTableHeads}
            data={additional_expenses as any}
            isLoading={isLoadingExpenses && isNew}
          />
        </>
      )}

      {!isDisabled && (
        <Footer>
          <Button
            content="Odustani"
            variant="secondary"
            onClick={() => navigate('/finance/deposit/transit/payment-orders/overview')}
          />
          {!isNew && <Button content="Označi kao plaćeno" variant="primary" onClick={() => setPayModal(true)} />}
          <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSaving} />
        </Footer>
      )}

      {!isNew && data && payModal && (
        <PayOrderModal onClose={() => setPayModal(false)} isOpen={payModal} id={data?.id} />
      )}
    </FlexColumn>
  );
};

export default OrderByCaseNumberForm;
