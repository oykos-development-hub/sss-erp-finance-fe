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
import {
  PropertyBenefitsConfiscationOverviewItem,
  PropertyBenefitsConfiscationForm,
} from '../../../../types/graphQL/propertyBenefitsConfiscation.ts';
import useInsertPropertyBenefitsConfiscation from '../../../../services/graphQL/propertyBenefitsConfiscation/useInsertPropertyBenefitsConfiscation.ts';

const propertyBenefitsConfiscationSchema = yup.object().shape({
  property_benefits_confiscation_type: optionsNumberSchema.required(requiredError).default(null),
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
  property_benefits_confiscation_type: undefined,
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

type PropertyBenefitsConfiscationEntryForm = yup.InferType<typeof propertyBenefitsConfiscationSchema>;
interface PropertyBenefitsConfiscationFormProps {
  property_benefits_confiscation?: PropertyBenefitsConfiscationOverviewItem;
}
const PropertyBenefitsConfiscationForm = ({property_benefits_confiscation}: PropertyBenefitsConfiscationFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<PropertyBenefitsConfiscationEntryForm>({
    resolver: yupResolver(propertyBenefitsConfiscationSchema),
    defaultValues: defaultValues,
  });
  const [uploadedFile, setUploadedFile] = useState<FileList>();
  const {counts} = useGetCountOverview({});
  const {insertPropertyBenefitsConfiscation, loading} = useInsertPropertyBenefitsConfiscation();
  const {
    alert,
    fileService: {uploadFile},
    navigation: {navigate},
  } = useAppContext();

  const countsDropdownOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);
  const onSubmit = async (data: any) => {
    const {
      account,
      court_account,
      created_at,
      updated_at,
      file,
      status,
      property_benefits_confiscation_details,
      ...rest
    } = data;
    let payload: PropertyBenefitsConfiscationForm = {
      ...rest,
      amount: Number(data.amount),
      court_costs: Number(data.court_costs),
      property_benefits_confiscation_type: data.property_benefits_confiscation_type.id,
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

      insertOrUpdatePropertyBenefitsConfiscation(payload);
    } else {
      insertOrUpdatePropertyBenefitsConfiscation(payload);
    }
  };

  useEffect(() => {
    if (property_benefits_confiscation) {
      reset({
        ...property_benefits_confiscation,
        property_benefits_confiscation_type: actTypeOptions.find(
          option => option?.id === property_benefits_confiscation.property_benefits_confiscation_type?.id,
        ),
        account_id: countsDropdownOptions?.find(count => count?.id === property_benefits_confiscation.account?.id),
        court_account_id: countsDropdownOptions?.find(
          count => count?.id === property_benefits_confiscation.court_account?.id,
        ),
        decision_date: new Date(property_benefits_confiscation.decision_date),
        payment_deadline_date: new Date(property_benefits_confiscation.payment_deadline_date),
        execution_date: new Date(property_benefits_confiscation.execution_date),
      });
    }
  }, [property_benefits_confiscation]);

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };

  const insertOrUpdatePropertyBenefitsConfiscation = async (payload: PropertyBenefitsConfiscationForm) => {
    // update property benefits confiscation
    if (property_benefits_confiscation && property_benefits_confiscation.id) {
      const updatedPayload = {...payload, id: property_benefits_confiscation.id};

      await insertPropertyBenefitsConfiscation(
        updatedPayload,
        () => {
          alert.success('Oduzimanje imovinske koristi uspješno izmijenjeno');
        },
        () => {
          alert.error('Došlo je do greške prilikom izmjene oduzimanja imovinske koristi');
        },
      );
      return;
    }

    // create procedural cost
    await insertPropertyBenefitsConfiscation(
      payload,
      id => {
        navigate(`/finance/fines-taxes/confiscation/${id}`);
        alert.success('Oduzimanje imovinske koristi uspješno kreirano');
      },
      () => {
        alert.error('Došlo je do greške prilikom kreiranja oduzimanja imovinske koristi');
      },
    );
  };

  return (
    <Container>
      <Row>
        <Controller
          name="property_benefits_confiscation_type"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="VRSTA AKTA:"
              placeholder={'Odaberite vrstu oduzimanja imovinske koristi'}
              options={actTypeOptions}
              isRequired
              error={errors.property_benefits_confiscation_type?.message}
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
        <Controller
          name={'amount'}
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              value={value.toString()}
              onChange={onChange}
              label="VISINA KAZNE:"
              type={'currency'}
              inputMode={'decimal'}
              leftContent={<div>€</div>}
              isRequired
              error={errors.amount?.message}
            />
          )}
        />

        <Input
          value={property_benefits_confiscation?.property_benefits_confiscation_details.amount_grace_period.toFixed(2)}
          label={`2/3 KAZNE - UKOLIKO UPLATITE DO ${parseDate(
            property_benefits_confiscation?.property_benefits_confiscation_details.amount_grace_period_due_date ?? null,
          )}`}
          type={'currency'}
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
        <Controller
          control={control}
          name={'court_costs'}
          render={({field: {onChange, value}}) => (
            <Input
              onChange={onChange}
              value={value?.toString()}
              label="SUDSKI TROŠKOVI:"
              type={'currency'}
              inputMode={'decimal'}
              leftContent={<div>€</div>}
              style={{flexGrow: 1 / 2}}
            />
          )}
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
        <FileList files={(property_benefits_confiscation?.file && property_benefits_confiscation?.file) ?? []} />
      </Row>
      <Footer>
        <Button content="Odustani" variant="secondary" style={{width: 130}} onClick={() => reset()} />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} isLoading={loading} />
      </Footer>
    </Container>
  );
};

export default PropertyBenefitsConfiscationForm;
