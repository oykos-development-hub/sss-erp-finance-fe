import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, FileUpload, Table, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import FileList from '../../../../components/fileList/fileList';
import {requiredError} from '../../../../constants';
import useAppContext from '../../../../context/useAppContext';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers';
import useGetAdditionalExpenses from '../../../../services/graphQL/transitDeposits/useGetAdditionalExpenses';
import useInsertDepositPaymentOrder from '../../../../services/graphQL/transitDeposits/useInsertDepositPaymentOrder';
import {FlexColumn, FlexRow} from '../../../../shared/flex';
import Footer from '../../../../shared/footer';
import {TableTitle} from '../../../../shared/tableTitle';
import {DepositPaymentOrder, PaymentOrderAdditionalExpense} from '../../../../types/graphQL/depositPaymentOrders';
import {parseDateForBackend} from '../../../../utils/dateUtils';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';
import {additionalExpensesTableHeads} from './constants';
import PayOrderModal from './payOrderModal';

const SUBJECT_ENTITY = 'other';

type TaxOrderFormProps = {
  data?: DepositPaymentOrder;
  refetchPaymentOrder?: () => void;
};

const taxOrderSchema = yup.object().shape({
  id: yup.number().nullable().default(null),
  file_id: yup.number().nullable().default(null),
  source_bank_account: optionsStringSchema.required(requiredError),
  //* Unfortunate naming, should be subject_id - to whom we are paying the taxes.
  supplier_id: optionsNumberSchema.required(requiredError),
  bank_account: optionsStringSchema.required(requiredError),
  date_of_payment: yup.date().required(requiredError),
  id_of_statement: yup.string(),
  date_of_statement: yup.date().nullable().default(null),
  additional_expenses_for_paying: yup
    .array()
    .of(
      yup.object().shape({
        price: yup.number().required(requiredError),
        title: yup.string().required(requiredError),
        subject_id: yup.number().required(requiredError),
        organization_unit_id: yup.number().required(requiredError),
        id: yup.number().required(requiredError),
      }),
    )
    .required(requiredError),
});

type TaxOrderFormType = yup.InferType<typeof taxOrderSchema>;

const TaxOrderForm = ({data, refetchPaymentOrder}: TaxOrderFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const [payModal, setPayModal] = useState(false);

  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {
      organization_unit: {id: organization_unit_id, bank_accounts: org_unit_bank_accounts},
    },
    fileService: {uploadFile},
    alert,
  } = useAppContext();

  const id = pathname.split('/').pop();
  const isNew = id === 'add-new';

  const {
    handleSubmit,
    formState: {errors},
    setValue,
    control,
    reset,
    watch,
    trigger,
  } = useForm<TaxOrderFormType>({
    resolver: yupResolver(taxOrderSchema),
  });

  const subject = watch('supplier_id');

  const {date_of_statement, id_of_statement, additional_expenses_for_paying, source_bank_account} = watch();

  const {insertDepositPaymentOrder, loading: isSaving} = useInsertDepositPaymentOrder();

  const {suppliers: subjects} = useGetSuppliers({
    entity: SUBJECT_ENTITY,
  });

  const {fetchAdditionalExpenses, loading: isLoadingExpenses} = useGetAdditionalExpenses(
    {organization_unit_id, subject_id: subject?.id, source_bank_account: source_bank_account?.id, status: 'Kreiran'},
    {
      onSuccess: data => {
        //* We need to adapt the data to the form field format.
        const additionalExpensesToPayTransformed = data
          ? data.map((item: PaymentOrderAdditionalExpense) => ({
              price: item.price,
              title: item.title,
              subject_id: item.subject.id,
              organization_unit_id,
              id: item.id,
            }))
          : [];
        setValue('additional_expenses_for_paying', additionalExpensesToPayTransformed);
      },
    },
  );

  const onGetAdditionalExpenses = async () => {
    trigger(['source_bank_account', 'supplier_id']);
    if (!source_bank_account || !subject) return;

    await fetchAdditionalExpenses();
  };

  const onCheckTableRow = (checked: boolean, id: number | null, all?: boolean) => {
    if (all) {
      setCheckedRows(checked ? additional_expenses_for_paying.map((_, index) => index) : []);
    } else {
      if (id) {
        setCheckedRows(prev => (checked ? [...prev, id] : prev.filter(item => item !== id)));
      }
    }
  };

  const onSubmit = async (data: TaxOrderFormType) => {
    if (!checkedRows.length) {
      alert.error('Morate izabrati bar jedan dodatni trošak za plaćanje');
      return;
    }

    const additionalExpensesForPaying = additional_expenses_for_paying.filter(item => checkedRows.includes(item.id));

    const payload = {
      id: data.id ? data.id : null,
      date_of_payment: parseDateForBackend(data.date_of_payment) as string,
      organization_unit_id,
      bank_account: data.bank_account.id,
      file_id: data.file_id ? data.file_id : null,
      supplier_id: data.supplier_id.id,
      additional_expenses_for_paying: additionalExpensesForPaying,
      additional_expenses: null,
      tax_authority_codebook_id: null,
      municipality_id: null,
      source_bank_account: data.source_bank_account?.id,
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

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        file_id: data.file.id,
        supplier_id: data.supplier,
        bank_account: {id: data.bank_account, title: data.bank_account},
        date_of_payment: new Date(data.date_of_payment),
        id_of_statement: data.id_of_statement,
        date_of_statement: data.date_of_statement ? new Date(data.date_of_statement) : null,
        additional_expenses_for_paying: data.additional_expenses_for_paying,
        source_bank_account: {id: data.source_bank_account, title: data.source_bank_account},
      });
    }
  }, [data]);

  const bankAccountOptions = useMemo(() => {
    if (!subject) return [];

    const options = subjects.find(item => item.id === subject.id)?.bank_accounts.map(item => ({id: item, title: item}));
    return options ?? [];
  }, [subject]);

  const orgUnitBankAccountOptions = useMemo(() => {
    if (!org_unit_bank_accounts) return [];
    return org_unit_bank_accounts.map((item: string) => ({id: item, title: item}));
  }, [org_unit_bank_accounts]);

  //* If there is a date and id of statement, it means this has been payed, so everthing should be disabled.
  const isDisabled = Boolean(date_of_statement && id_of_statement);

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
              onChange={onChange}
              options={orgUnitBankAccountOptions}
              error={errors.source_bank_account?.message}
              isDisabled={isDisabled || !isNew}
            />
          )}
        />
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
            />
          )}
        />
      </FlexRow>

      <FlexRow gap={8}>
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
              />
            )}
          />
        </div>
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
        <FileList files={data?.file.id ? [data.file] : null} />
      </div>
      {!isDisabled && isNew && (
        <Button
          content="Pretraži dodatne troškove"
          onClick={onGetAdditionalExpenses}
          variant="primary"
          style={{width: 'fit-content'}}
        />
      )}

      {Boolean(additional_expenses_for_paying?.length) && (
        <>
          <TableTitle style={{marginTop: 30}}>
            <Typography variant="bodyLarge" content="Porezi i prirezi" style={{fontWeight: 'bold'}} />
          </TableTitle>
          <Table
            tableHeads={additionalExpensesTableHeads}
            data={additional_expenses_for_paying}
            isLoading={isLoadingExpenses && isNew}
            checkboxes={!isDisabled && isNew}
            onCheck={onCheckTableRow}
            checkedRows={checkedRows}
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

export default TaxOrderForm;
