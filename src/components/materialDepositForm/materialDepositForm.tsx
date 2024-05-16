import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, FileUpload, Input, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useInsertFixedDeposit from '../../services/graphQL/fixedDeposits/useInsertFixedDeposit';
import {FlexColumn, FlexRow} from '../../shared/flex';
import Footer from '../../shared/footer';
import {FixedDeposit} from '../../types/graphQL/fixedDeposits';
import {parseDateForBackend} from '../../utils/dateUtils';
import {optionsNumberSchema} from '../../utils/formSchemas';
import FileList from '../fileList/fileList';

const materialDepositSchema = yup.object({
  case_number: yup.string().required(requiredError),
  subject: yup.string().required(requiredError),
  account_id: optionsNumberSchema,
  date_of_recipiet: yup.date().required(requiredError).default(null),
  date_of_case: yup.date().required(requiredError).default(null),
  date_of_enforceability: yup.date().nullable().default(null),
  date_of_finality: yup.date().nullable().default(null),
  date_of_end: yup.date().nullable().default(null),
  file_id: yup.number().nullable().default(null),
});

type MaterialDepositForm = yup.InferType<typeof materialDepositSchema>;

const MaterialDepositForm = ({data}: {data?: FixedDeposit}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {
      organization_unit: {id: organization_unit_id},
    },
    fileService: {uploadFile},
    alert,
  } = useAppContext();

  const id = pathname.split('/').pop();
  const isNew = id === 'add-new';

  const {
    register,
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<MaterialDepositForm>({
    resolver: yupResolver(materialDepositSchema),
  });

  const {insertFixedDeposit, loading: isSaving} = useInsertFixedDeposit();

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: MaterialDepositForm) => {
    const payload = {
      ...data,
      date_of_recipiet: parseDateForBackend(data.date_of_recipiet) as string,
      date_of_case: parseDateForBackend(data.date_of_case) as string,
      date_of_end: parseDateForBackend(data.date_of_end) as string,
      date_of_finality: parseDateForBackend(data.date_of_finality) as string,
      date_of_enforceability: parseDateForBackend(data.date_of_enforceability) as string,
      organization_unit_id,
      type: 'material',
      id: id ? parseInt(id) : null,
      file_id: data.file_id ? data.file_id : null,
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

    await insertFixedDeposit(
      payload,
      (data: FixedDeposit) => {
        alert.success(
          isNew ? 'Uspješno ste dodali novi materijalni depozit' : 'Uspješno ste izmjenili materijalni depozit',
        );
        if (isNew) {
          navigate(`/finance/deposit/fixed/material/${data.id}`);
        }
      },
      () => {
        alert.error(
          isNew
            ? 'Greška prilikom dodavanja novog materijalnog depozita'
            : 'Greška prilikom izmjene materijalnog depozita',
        );
      },
    );
  };

  useEffect(() => {
    if (data && !isNew) {
      reset({
        file_id: data?.file.id,
        case_number: data?.case_number,
        subject: data?.subject,
        date_of_recipiet: new Date(data?.date_of_recipiet),
        date_of_case: new Date(data?.date_of_case),
        date_of_enforceability: data?.date_of_enforceability ? new Date(data?.date_of_enforceability) : null,
        date_of_finality: data?.date_of_finality ? new Date(data?.date_of_finality) : null,
        date_of_end: data?.date_of_end ? new Date(data?.date_of_end) : null,
      });
    }
  }, [data]);

  const disabled = data?.status === 'Zakljucen';

  return (
    <FlexColumn gap={20} style={{alignItems: 'stretch'}}>
      <FlexRow gap={8}>
        <Input
          {...register('case_number')}
          label="BROJ PREDMETA:"
          error={errors.case_number?.message}
          disabled={disabled}
        />
        <Input
          {...register('subject')}
          label="IME I PREZIME STRANKE:"
          error={errors.subject?.message}
          disabled={disabled}
        />
      </FlexRow>
      <FlexRow gap={8}>
        <Controller
          name="date_of_recipiet"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM PRIJEMA AKTA"
              onChange={onChange}
              error={errors.date_of_recipiet?.message}
              disabled={disabled}
            />
          )}
        />
        <Controller
          name="date_of_case"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM PREDMETA"
              onChange={onChange}
              error={errors.date_of_case?.message}
              disabled={disabled}
            />
          )}
        />
        <Controller
          name="date_of_enforceability"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM IZVRŠNOSTI"
              onChange={onChange}
              error={errors.date_of_enforceability?.message}
              disabled={disabled}
            />
          )}
        />
      </FlexRow>
      <FlexRow gap={8}>
        <Controller
          name="date_of_finality"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM PRAVOSNAŽNOSTI"
              onChange={onChange}
              error={errors.date_of_finality?.message}
              disabled={disabled}
            />
          )}
        />
        <Controller
          name="date_of_end"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM ZAKLJUČENJA"
              onChange={onChange}
              error={errors.date_of_end?.message}
              disabled={isNew || disabled}
            />
          )}
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
          disabled={disabled}
        />
        <FileList files={data?.file.id ? [data.file] : null} />
      </div>

      {!disabled && (
        <Footer>
          <Button
            content="Odustani"
            variant="secondary"
            onClick={() => navigate('/finance/deposit/fixed/material/overview')}
          />
          <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSaving} />
        </Footer>
      )}
    </FlexColumn>
  );
};

export default MaterialDepositForm;
