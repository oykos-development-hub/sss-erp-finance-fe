import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Checkbox, Datepicker, Dropdown, FileUpload, Input, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import FileList from '../../../../components/fileList/fileList';
import {requiredError} from '../../../../constants';
import useAppContext from '../../../../context/useAppContext';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview';
import useInsertDepositPayment from '../../../../services/graphQL/transitDeposits/useInsertDepositPayment';
import {FlexColumn, FlexRow} from '../../../../shared/flex';
import Footer from '../../../../shared/footer';
import {DepositPayment, DepositPaymentInsertData} from '../../../../types/graphQL/depositPayments';
import {parseDateForBackend} from '../../../../utils/dateUtils';
import {optionsNumberSchema, optionsStringSchema} from '../../../../utils/formSchemas';

const depositPaymentSchema = yup.object({
  payer: yup.string().required(requiredError),
  case_number: yup.string().required(requiredError),
  party_name: yup.string().required(requiredError),
  number_of_bank_statement: yup.string().required(requiredError),
  date_of_bank_statement: yup.date().required(requiredError),
  amount: yup.number().required(requiredError),
  main_bank_account: yup.boolean().required(requiredError),
  account_id: optionsNumberSchema.required(requiredError),
  current_bank_account: optionsStringSchema.when('main_bank_account', {
    is: false,
    then: schema => schema.required(requiredError),
  }),
  date_of_transfer_main_account: yup.date().when('main_bank_account', {
    is: false,
    then: schema => schema.required(requiredError),
  }),
  file_id: yup.number().nullable().default(null),
  id: yup.number().nullable().default(null),
});

type DepositPaymentForm = yup.InferType<typeof depositPaymentSchema>;

type DepositPaymentFormProps = {
  data?: DepositPayment;
  isLoading?: boolean;
};

const DepositPaymentForm = ({data, isLoading}: DepositPaymentFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    alert,
    fileService: {uploadFile},
    contextMain: {
      organization_unit: {bank_accounts: org_unit_bank_accounts},
    },
  } = useAppContext();

  const id = pathname.split('/').pop();
  const isNew = id === 'add-new';

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    watch,
    reset,
  } = useForm<DepositPaymentForm>({
    resolver: yupResolver(depositPaymentSchema),
    defaultValues: {main_bank_account: false},
  });

  const {insertDepositPayment, loading: isSaving} = useInsertDepositPayment();
  const {counts} = useGetCountOverview({});

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: DepositPaymentForm) => {
    const payload: DepositPaymentInsertData = {
      ...data,
      date_of_bank_statement: parseDateForBackend(data.date_of_bank_statement) as string,
      date_of_transfer_main_account: data.date_of_transfer_main_account
        ? parseDateForBackend(data.date_of_transfer_main_account)
        : null,
      current_bank_account: data.current_bank_account ? data.current_bank_account.id : null,
      //* Unfortunate naming of this field requires us to send the opposite value.
      //* Should have been named transit_bank_account or something similar.
      main_bank_account: !data.main_bank_account,
      account_id: data.account_id.id,
      file_id: data.file_id ? data.file_id : null,
      id: isNew ? null : parseInt(id),
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

    await insertDepositPayment(
      payload,
      () => {
        alert.success('Uplata je uspješno sačuvana.');
        navigate('/finance/deposit/transit/payments/overview');
      },
      () => {
        alert.error('Došlo je do greške prilikom čuvanja uplate.');
      },
    );
  };

  useEffect(() => {
    if (data) {
      reset({
        payer: data.payer,
        case_number: data.case_number,
        party_name: data.party_name,
        number_of_bank_statement: data.number_of_bank_statement,
        date_of_bank_statement: new Date(data.date_of_bank_statement),
        amount: data.amount,
        main_bank_account: !data.main_bank_account,
        date_of_transfer_main_account: data.date_of_transfer_main_account
          ? new Date(data.date_of_transfer_main_account)
          : undefined,
        account_id: data.account,
        current_bank_account: {id: data.current_bank_account, title: data.current_bank_account},
      });
    }
  }, [data]);

  const isMainBankAccount = watch('main_bank_account');
  const mainAccountPayed = Boolean(data?.current_bank_account);

  const orgUnitBankAccountOptions = useMemo(() => {
    if (!org_unit_bank_accounts) return [];
    return org_unit_bank_accounts.map((item: string) => ({id: item, title: item}));
  }, [org_unit_bank_accounts]);

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <FlexColumn gap={20} align="stretch">
        <FlexRow gap={8}>
          <Input label="UPLATILAC:" {...register('payer')} error={errors.payer?.message} />
          <Input label="BROJ PREDMETA:" {...register('case_number')} error={errors.case_number?.message} />
        </FlexRow>
        <FlexRow gap={8}>
          <Input label="STRANKA U POSTUPKU:" {...register('party_name')} error={errors.party_name?.message} />
          <Input
            label="BROJ IZVODA:"
            {...register('number_of_bank_statement')}
            error={errors.number_of_bank_statement?.message}
          />
        </FlexRow>
        <FlexRow gap={8}>
          <div style={{width: '100%'}}>
            <Controller
              control={control}
              name="date_of_bank_statement"
              render={({field: {name, value, onChange}}) => (
                <Datepicker
                  label="DATUM IZVODA:"
                  onChange={onChange}
                  selected={value ? new Date(value) : null}
                  name={name}
                  error={errors.date_of_bank_statement?.message}
                />
              )}
            />
          </div>

          <Input label="IZNOS:" {...register('amount')} error={errors.amount?.message} />
        </FlexRow>
        <FlexRow gap={8}>
          <Controller
            control={control}
            name="account_id"
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                options={counts}
                value={value}
                onChange={onChange}
                label="KONTO:"
                error={errors.account_id?.message}
              />
            )}
          />
        </FlexRow>
        {!mainAccountPayed && (
          <div>
            <Controller
              name="main_bank_account"
              control={control}
              render={({field: {name, value, onChange}}) => {
                return (
                  <FlexRow align="center" gap={8} style={{width: 'fit-content'}}>
                    <Checkbox onChange={onChange} name={name} checked={value} />
                    <Typography content="Prelazni račun" variant="bodySmall" />
                  </FlexRow>
                );
              }}
            />
          </div>
        )}

        <FlexRow gap={8}>
          <Controller
            control={control}
            name="current_bank_account"
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                label="GLAVNI RAČUN:"
                name={name}
                value={value}
                onChange={onChange}
                options={orgUnitBankAccountOptions}
                error={errors.current_bank_account?.message}
                isDisabled={(isMainBankAccount && isNew) || mainAccountPayed}
              />
            )}
          />

          <div style={{width: '100%'}}>
            <Controller
              control={control}
              name="date_of_transfer_main_account"
              render={({field: {name, value, onChange}}) => (
                <Datepicker
                  label="DATUM UPLATE NA GLAVNI RAČUN:"
                  onChange={onChange}
                  selected={value ? new Date(value) : null}
                  name={name}
                  error={errors.date_of_transfer_main_account?.message}
                  disabled={isMainBankAccount || mainAccountPayed}
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
          />
          <FileList files={data?.file.id ? [data.file] : null} />
        </div>
      </FlexColumn>

      <Footer>
        <Button
          content="Odustani"
          variant="secondary"
          onClick={() => navigate('/finance/deposit/transit/payments/overview')}
        />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSaving} />
      </Footer>
    </div>
  );
};

export default DepositPaymentForm;
