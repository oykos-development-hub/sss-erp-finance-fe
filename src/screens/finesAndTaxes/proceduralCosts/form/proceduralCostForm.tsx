import {Controller, useForm} from 'react-hook-form';
import {Dropdown, Datepicker, Input, Typography, FileUpload, Button, Theme} from 'client-library';
import {Container, Row} from '../../taxes/addFee/styles.ts';
import {actTypeOptions, generateDropdownOptions, requiredError} from '../../../../constants.ts';
import {useEffect, useMemo, useState} from 'react';
import Footer from '../../../../shared/footer.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import {parseDate, parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FileList from '../../../../components/fileList/fileList.tsx';
import {optionsNumberSchema} from '../../../../utils/formSchemas.ts';
import {ProceduralCostOverviewItem, ProceduralCostsForm} from '../../../../types/graphQL/proceduralCosts.ts';
import useInsertProceduralCost from '../../../../services/graphQL/proceduralCosts/useInsertProceduralCost.ts';

const proceduralCostSchema = yup.object().shape({
  procedure_cost_type: optionsNumberSchema.required(requiredError).default(null),
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
  procedure_cost_type: undefined,
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

type ProceduralCostEntryForm = yup.InferType<typeof proceduralCostSchema>;
interface ProceduralCostFormProps {
  procedural_cost?: ProceduralCostOverviewItem;
}
const ProceduralCostForm = ({procedural_cost}: ProceduralCostFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<ProceduralCostEntryForm>({resolver: yupResolver(proceduralCostSchema), defaultValues: defaultValues});
  const [uploadedFile, setUploadedFile] = useState<FileList>();
  const {counts} = useGetCountOverview({});
  const {insertProceduralCost, loading} = useInsertProceduralCost();
  const {
    alert,
    fileService: {uploadFile},
    navigation: {navigate},
  } = useAppContext();

  const countsDropdownOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);
  const onSubmit = async (data: any) => {
    const {account, court_account, created_at, updated_at, file, status, procedure_cost_details, ...rest} = data;
    let payload: ProceduralCostsForm = {
      ...rest,
      amount: Number(data.amount),
      court_costs: Number(data.court_costs),
      procedure_cost_type: data.procedure_cost_type.id,
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

      insertOrUpdateProceduralCost(payload);
    } else {
      insertOrUpdateProceduralCost(payload);
    }
  };

  useEffect(() => {
    if (procedural_cost) {
      reset({
        ...procedural_cost,
        procedure_cost_type: actTypeOptions.find(option => option?.id === procedural_cost.procedure_cost_type?.id),
        account_id: countsDropdownOptions?.find(count => count?.id === procedural_cost.account?.id),
        court_account_id: countsDropdownOptions?.find(count => count?.id === procedural_cost.court_account?.id),
        decision_date: new Date(procedural_cost.decision_date),
        payment_deadline_date: new Date(procedural_cost.payment_deadline_date),
        execution_date: new Date(procedural_cost.execution_date),
      });
    }
  }, [procedural_cost]);

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };

  const insertOrUpdateProceduralCost = async (payload: ProceduralCostsForm) => {
    // update procedural cost
    if (procedural_cost && procedural_cost.id) {
      const updatedPayload = {...payload, id: procedural_cost.id};

      await insertProceduralCost(
        updatedPayload,
        () => {
          alert.success('Trošak postupka uspješno izmijenjen');
        },
        () => {
          alert.error('Došlo je do greške prilikom izmjene troška postupka');
        },
      );
      return;
    }

    // create procedural cost
    await insertProceduralCost(
      payload,
      id => {
        navigate(`/finance/fines-taxes/procedural-costs/${id}`);
        alert.success('Trošak postupka uspješno kreiran');
      },
      () => {
        alert.error('Došlo je do greške prilikom kreiranja troška postupka');
      },
    );
  };

  return (
    <Container>
      <Row>
        <Controller
          name="procedure_cost_type"
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
              error={errors.procedure_cost_type?.message}
            />
          )}
        />
        <Input {...register('subject')} label="SUBJEKAT:" isRequired error={errors.subject?.message} />
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
          label="VISINA TROŠKA POSTUPKA:"
          type={'number'}
          inputMode={'decimal'}
          leftContent={<div>€</div>}
          isRequired
          error={errors.amount?.message}
        />
        <Input
          value={procedural_cost?.procedure_cost_details.amount_grace_period.toFixed(2)}
          label={`2/3 TROŠKA POSTUPKA - UKOLIKO UPLATITE DO ${parseDate(
            procedural_cost?.procedure_cost_details.amount_grace_period_due_date ?? null,
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
              label="ROK ZA PLAĆANJE UKUPNOG TROŠKA POSTUPKA:"
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
        <FileList files={(procedural_cost?.file && procedural_cost?.file) ?? []} />
      </Row>
      <Footer>
        <Button content="Odustani" variant="secondary" style={{width: 130}} onClick={() => reset()} />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} isLoading={loading} />
      </Footer>
    </Container>
  );
};

export default ProceduralCostForm;
