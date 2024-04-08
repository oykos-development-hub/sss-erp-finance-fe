import {Controller, useForm} from 'react-hook-form';
import {Dropdown, Datepicker, Input, Typography, FileUpload, Button, Theme} from 'client-library';
import {Container, Row} from './styles.ts';
import {actTypeOptions, generateDropdownOptions, requiredError} from '../../../../constants.ts';
import {useEffect, useMemo, useState} from 'react';
import Footer from '../../../../shared/footer.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import useInsertFine from '../../../../services/graphQL/fines/useInsertFine.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import {parseDate, parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {FineForm} from '../../../../types/graphQL/fineForm.ts';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FileList from '../../../../components/fileList/fileList.tsx';
import {FinesOverviewItem} from '../../../../types/graphQL/finesOverview.ts';
import {optionsNumberSchema} from '../../../../utils/formSchemas.ts';

const fineSchema = yup.object().shape({
  act_type: optionsNumberSchema.required(requiredError).default(null),
  decision_number: yup.string().required(requiredError),
  decision_date: yup.date().required(requiredError),
  subject: yup.string().required(requiredError),
  jmbg: yup
    .string()
    .matches(/^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])(\d{3})(2[1-9]|29)\d{3}\d{1}$/, 'Neispravan JMBG format')
    .length(13, 'JMBG mora da ima 13 cifara')
    .required(requiredError),
  account_id: optionsNumberSchema.required(requiredError).default(null),
  residence: yup.string().required(requiredError),
  amount: yup.number().typeError('Morate unijeti broj').required(requiredError),
  payment_reference_number: yup.string().required(requiredError),
  debit_reference_number: yup.string().required(requiredError),
  execution_date: yup.date().required(requiredError),
  payment_deadline_date: yup.date().required(requiredError),
  court_costs: yup.number().optional(),
  description: yup.string(),
  court_account_id: optionsNumberSchema.nullable().default(null),
});

const defaultValues = {
  act_type: undefined,
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
  court_costs: 0,
  description: '',
  court_account_id: undefined,
};

type FineEntryForm = yup.InferType<typeof fineSchema>;
interface FineFormProps {
  fine?: FinesOverviewItem;
}
const FineForm = ({fine}: FineFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FineEntryForm>({resolver: yupResolver(fineSchema), defaultValues: defaultValues});
  const [uploadedFile, setUploadedFile] = useState<FileList>();
  const {counts} = useGetCountOverview({});
  const {insertFine} = useInsertFine();
  const {
    alert,
    fileService: {uploadFile},
    navigation: {navigate},
  } = useAppContext();

  const countsDropdownOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);
  const onSubmit = async (data: any) => {
    const {account, court_account, created_at, updated_at, file, status, fine_fee_details, ...rest} = data;
    let payload: FineForm = {
      ...rest,
      amount: Number(data.amount),
      court_costs: Number(data.court_costs),
      act_type: data.act_type.id,
      account_id: data.account_id.id,
      court_account_id: data.court_account_id?.id,
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

      insertOrUpdateFine(payload);
    } else {
      insertOrUpdateFine(payload);
    }
  };

  useEffect(() => {
    if (fine) {
      reset({
        ...fine,
        act_type: actTypeOptions.find(option => option?.id === fine.act_type?.id),
        account_id: countsDropdownOptions?.find(count => count?.id === fine.account?.id),
        court_account_id: countsDropdownOptions?.find(count => count?.id === fine.court_account?.id),
        decision_date: new Date(fine.decision_date),
        payment_deadline_date: new Date(fine.payment_deadline_date),
        execution_date: new Date(fine.execution_date),
      });
    }
  }, [fine]);

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };

  const insertOrUpdateFine = async (payload: FineForm) => {
    // update fine
    if (fine && fine.id) {
      const updatedPayload = {...payload, id: fine.id};

      await insertFine(
        updatedPayload,
        () => {
          alert.success('Kazna uspješno izmijenjena');
        },
        () => {
          alert.error('Došlo je do greške prilikom izmjene kazne');
        },
      );
      return;
    }

    // create fine
    await insertFine(
      payload,
      id => {
        navigate(`/finance/fines-taxes/fines/${id}`);
        alert.success('Kazna uspješno kreirana');
      },
      () => {
        alert.error('Došlo je do greške prilikom kreiranja kazne');
      },
    );
  };

  return (
    <Container>
      <Row>
        <Controller
          name="act_type"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="VRSTA AKTA:"
              placeholder={'Odaberite vrstu akta'}
              options={actTypeOptions}
              isRequired
              error={errors.act_type?.message}
            />
          )}
        />
        <Input {...register('subject')} label="Subjekat:" isRequired error={errors.subject?.message} />
      </Row>
      <Row>
        <Input {...register('jmbg')} label="JMBG:" isRequired error={errors.jmbg?.message} />
        <Input {...register('residence')} label="PREBIVALIŠTE:" isRequired error={errors.residence?.message} />
      </Row>
      <Row>
        <Input
          {...register('decision_number')}
          label="BROJ RJEŠENJA / PRESUDE:"
          isRequired
          error={errors.decision_number?.message}
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
        />
        <Input
          {...register('payment_reference_number')}
          label="POZIV NA BROJ ODOBRENJA:"
          isRequired
          error={errors.payment_reference_number?.message}
        />
      </Row>
      <Row>
        <Input
          {...register('amount')}
          label="VISINA KAZNE:"
          type={'number'}
          inputMode={'decimal'}
          leftContent={<div>€</div>}
          isRequired
          error={errors.amount?.message}
        />
        <Input
          value={fine?.fine_fee_details.fee_amount_grace_period.toFixed(2)}
          label={`2/3 KAZNE - UKOLIKO UPLATITE DO ${parseDate(
            fine?.fine_fee_details.fee_amount_grace_period_due_date ?? null,
          )}`}
          type={'number'}
          inputMode={'decimal'}
          leftContent={<div style={{color: Theme.palette.gray300}}>€</div>}
          disabled
        />
      </Row>
      <Row>
        <Controller
          name="account_id"
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
              error={errors.account_id?.message}
            />
          )}
        />
        <Input
          {...register('court_costs')}
          label="SUDSKI TROŠKOVI:"
          type={'number'}
          inputMode={'decimal'}
          leftContent={<div>€</div>}
          style={{flexGrow: 1 / 2}}
        />
        <Controller
          name="court_account_id"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="KONTO ZA SUDSKE TROŠKOVE:"
              placeholder={'Odaberite konto za sudske troškove'}
              options={countsDropdownOptions}
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
              label="ROK ZA PLAĆANJE UKUPNE KAZNE:"
              onChange={onChange}
              isRequired
              error={errors.payment_deadline_date?.message}
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
            />
          )}
        />
      </Row>
      <Row>
        <Input {...register('description')} label="OPIS:" textarea />
      </Row>

      <Row>
        <FileUpload
          icon={null}
          files={uploadedFile}
          variant="secondary"
          onUpload={handleUpload}
          note={<Typography variant="bodySmall" content="Dodaj fajl" />}
          buttonText="Učitaj"
        />
        <FileList files={(fine?.file && fine?.file) ?? []} />
      </Row>
      <Footer>
        <Button content="Odustani" variant="secondary" style={{width: 130}} onClick={() => reset()} />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
      </Footer>
    </Container>
  );
};

export default FineForm;
