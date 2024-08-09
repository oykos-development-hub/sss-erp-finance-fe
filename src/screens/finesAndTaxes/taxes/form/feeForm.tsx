import {Controller, useForm} from 'react-hook-form';
import {Dropdown, Datepicker, Input, Typography, FileUpload, Button} from 'client-library';
import {Container, Row} from './styles.ts';
import {feeSubcategoryOptions, feeTypeOptions, generateDropdownOptions, requiredError} from '../../../../constants.ts';
import {useEffect, useMemo, useState} from 'react';
import Footer from '../../../../shared/footer.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FileList from '../../../../components/fileList/fileList.tsx';
import {optionsNumberSchema} from '../../../../utils/formSchemas.ts';
import {FeeInsertParams} from '../../../../types/graphQL/fees.ts';
import useInsertFee from '../../../../services/graphQL/fees/useInsertFee.ts';
import {Fee} from '../constants.tsx';
import {checkActionRoutePermissions} from '../../../../services/checkRoutePermissions.ts';

const feeSchema = yup.object().shape({
  fee_type: optionsNumberSchema.required(requiredError).default(null),
  fee_subcategory: optionsNumberSchema.required(requiredError).default(null),
  decision_number: yup.string().required(requiredError),
  decision_date: yup.date().required(requiredError),
  subject: yup.string().required(requiredError),
  jmbg: yup
    .string()
    .matches(/^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])(\d{3})(2[1-9]|29)\d{3}\d{1}$/, 'Neispravan JMBG format')
    .length(13, 'JMBG mora da ima 13 cifara')
    .required(requiredError),
  residence: yup.string().required(requiredError),
  amount: yup.number().typeError('Morate unijeti broj').required(requiredError),
  payment_reference_number: yup.string().required(requiredError),
  debit_reference_number: yup.string().required(requiredError),
  execution_date: yup.date().required(requiredError),
  payment_deadline_date: yup.date().required(requiredError),
  description: yup.string(),
  court_account: optionsNumberSchema.nullable().default(null),
});

const defaultValues = {
  fee_type: undefined,
  fee_subcategory: undefined,
  decision_number: '',
  decision_date: undefined,
  subject: '',
  jmbg: '',
  account_id: undefined,
  residence: '',
  amount: 0,
  payment_reference_number: '',
  debit_reference_number: '',
  execution_date: undefined,
  payment_deadline_date: undefined,
  description: '',
  court_account: undefined,
};

type FeeEntryForm = yup.InferType<typeof feeSchema>;
export interface FeeFormProps {
  fee?: Fee;
}
const FeeForm = ({fee}: FeeFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FeeEntryForm>({resolver: yupResolver(feeSchema), defaultValues: defaultValues});
  const [uploadedFile, setUploadedFile] = useState<FileList>();
  const {counts} = useGetCountOverview({});
  const {insertFee, loading} = useInsertFee();
  const {
    alert,
    fileService: {uploadFile},
    navigation: {navigate},
    contextMain: {permissions},
  } = useAppContext();

  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/finance/fines-taxes/taxes');

  const countsDropdownOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);
  const onSubmit = async (data: any) => {
    const {account, court_account, created_at, updated_at, file, status, fee_details, ...rest} = data;
    let payload: FeeInsertParams = {
      ...rest,
      amount: Number(data.amount),
      fee_type: data.fee_type.id,
      court_account: data.court_account?.id,
      fee_subcategory: data.fee_subcategory?.id,
      decision_date: parseDateForBackend(data.decision_date),
      execution_date: parseDateForBackend(data.execution_date),
      payment_deadline_date: parseDateForBackend(data.payment_deadline_date),
    };

    if (uploadedFile) {
      const formData = new FormData();
      const fileArray = Array.from(uploadedFile);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setUploadedFile(undefined);
          payload = {...payload, file: [res[0]?.id]};
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
          return;
        },
      );

      insertOrUpdateFee(payload);
    } else {
      insertOrUpdateFee(payload);
    }
  };

  useEffect(() => {
    if (fee) {
      reset({
        ...fee,
        fee_type: feeTypeOptions.find(option => option?.id === fee.fee_type?.id),
        fee_subcategory: feeSubcategoryOptions.find(option => option?.id === fee.fee_type?.id),
        court_account: countsDropdownOptions?.find(count => count?.id === fee.court_account?.id),
        decision_date: new Date(fee.decision_date),
        payment_deadline_date: new Date(fee.payment_deadline_date),
        execution_date: new Date(fee.execution_date),
      });
    }
  }, [fee]);

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };

  const insertOrUpdateFee = async (payload: FeeInsertParams) => {
    // update fee
    if (fee && fee.id) {
      const updatedPayload = {...payload, id: fee.id};

      await insertFee(
        updatedPayload,
        () => {
          alert.success('Taksa uspješno izmijenjena');
        },
        () => {
          alert.error('Došlo je do greške prilikom izmjene takse');
        },
      );
      return;
    }

    // create fee
    await insertFee(
      payload,
      id => {
        navigate(`/finance/fines-taxes/fines/${id}`);
        alert.success('Taksa uspješno kreirana');
      },
      () => {
        alert.error('Došlo je do greške prilikom kreiranja takse');
      },
    );
  };

  return (
    <Container>
      <Row>
        <Controller
          name="fee_type"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="VRSTA TAKSE:"
              placeholder={'Odaberite vrstu takse'}
              options={feeTypeOptions}
              isRequired
              error={errors.fee_type?.message}
              isDisabled={!updatePermission}
            />
          )}
        />
        <Controller
          name="fee_subcategory"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="POTKATEGORIJA TAKSE:"
              placeholder={'Odaberite potkategoriju takse'}
              options={feeSubcategoryOptions}
              isRequired
              error={errors.fee_subcategory?.message}
              isDisabled={!updatePermission}
            />
          )}
        />
        <Input
          disabled={!updatePermission}
          {...register('subject')}
          label="SUBJEKAT:"
          isRequired
          error={errors.subject?.message}
        />
      </Row>
      <Row>
        <Input
          disabled={!updatePermission}
          {...register('jmbg')}
          label="JMBG:"
          isRequired
          error={errors.jmbg?.message}
        />
        <Input
          disabled={!updatePermission}
          {...register('residence')}
          label="PREBIVALIŠTE:"
          isRequired
          error={errors.residence?.message}
        />
      </Row>
      <Row>
        <Input
          {...register('decision_number')}
          label="BROJ RJEŠENJA / PRESUDE:"
          isRequired
          error={errors.decision_number?.message}
          disabled={!updatePermission}
        />
        <Controller
          name={'decision_date'}
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM RJEŠENJA / PRESUDE:"
              onChange={onChange}
              isRequired
              error={errors.decision_date?.message}
              isDisabled={!updatePermission}
            />
          )}
        />
      </Row>
      <Row>
        <Input
          {...register('debit_reference_number')}
          label="POZIV NA BROJ ZADUŽENJA:"
          isRequired
          error={errors.debit_reference_number?.message}
          disabled={!updatePermission}
        />
        <Input
          {...register('payment_reference_number')}
          label="POZIV NA BROJ ODOBRENJA:"
          isRequired
          error={errors.payment_reference_number?.message}
          disabled={!updatePermission}
        />
      </Row>
      <Row>
        <Controller
          name={'amount'}
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              value={value.toString()}
              onChange={onChange}
              label="VISINA TAKSE:"
              type={'currency'}
              inputMode={'decimal'}
              leftContent={<div>€</div>}
              isRequired
              error={errors.amount?.message}
              disabled={!updatePermission}
            />
          )}
        />

        <Controller
          name="court_account"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="KONTO:"
              placeholder={'Odaberite konto'}
              options={countsDropdownOptions}
              isRequired
              error={errors.court_account?.message}
              isDisabled={!updatePermission}
            />
          )}
        />
      </Row>
      <Row>
        <Controller
          name={'payment_deadline_date'}
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="ROK ZA PLAĆANJE UKUPNE TAKSE:"
              onChange={onChange}
              isRequired
              error={errors.payment_deadline_date?.message}
              isDisabled={!updatePermission}
            />
          )}
        />
        <Controller
          name={'execution_date'}
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM IZVRŠNOSTI:"
              onChange={onChange}
              isRequired
              error={errors.execution_date?.message}
              isDisabled={!updatePermission}
            />
          )}
        />
      </Row>
      <Row>
        <Input disabled={!updatePermission} {...register('description')} label="OPIS:" textarea />
      </Row>

      <Row>
        <FileUpload
          icon={null}
          files={uploadedFile}
          variant="secondary"
          onUpload={handleUpload}
          note={<Typography variant="bodySmall" content="Dodaj fajl" />}
          buttonText="Učitaj"
          disabled={!updatePermission}
        />
        <FileList files={(fee?.file && fee?.file) ?? []} />
      </Row>
      <Footer>
        <Button content="Odustani" variant="secondary" style={{width: 130}} onClick={() => reset()} />
        {updatePermission && (
          <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} isLoading={loading} />
        )}
      </Footer>
    </Container>
  );
};

export default FeeForm;
