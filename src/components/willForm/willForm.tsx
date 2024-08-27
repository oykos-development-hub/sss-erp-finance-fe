import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, FileUpload, Input, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useInsertWill from '../../services/graphQL/wills/useInsertWill';
import {FlexColumn, FlexRow} from '../../shared/flex';
import Footer from '../../shared/footer';
import {parseDateForBackend} from '../../utils/dateUtils';
import FileList from '../fileList/fileList';
import {Will} from '../../types/graphQL/wills';

const willFormSchema = yup.object({
  subject: yup.string().required(requiredError),
  case_number_si: yup.string().required(requiredError),
  case_number_rs: yup.string().required(requiredError),
  date_of_receipt_si: yup.date().required(requiredError),
  date_of_receipt_rs: yup.date().required(requiredError),
  date_of_end: yup.date().nullable().default(null),
  father_name: yup.string().required(requiredError),
  date_of_birth: yup.date().required(requiredError),
  jmbg: yup.string().required(requiredError),
  description: yup.string().default(''),
  file_id: yup.number().nullable().default(null),
  id: yup.number().nullable().default(null),
});

type WillFormSchemaType = yup.InferType<typeof willFormSchema>;

const WillForm = ({data}: {data?: Will}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  const {
    navigation: {
      navigate,
      location: {pathname},
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
  } = useForm<WillFormSchemaType>({
    resolver: yupResolver(willFormSchema),
  });

  const {insertWill, loading: isSaving} = useInsertWill();

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: WillFormSchemaType) => {
    const payload = {
      ...data,
      date_of_receipt_si: parseDateForBackend(data.date_of_receipt_si) as string,
      date_of_receipt_rs: parseDateForBackend(data.date_of_receipt_rs) as string,
      date_of_end: data.date_of_end ? parseDateForBackend(data.date_of_end) : null,
      date_of_birth: parseDateForBackend(data.date_of_birth) as string,
      file_id: data.file_id ? data.file_id : null,
      id: data.id ? data.id : null,
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

    await insertWill(
      payload,
      (id: number) => {
        alert.success(isNew ? 'Uspešno ste dodali novi testament.' : 'Uspešno ste izmjenili testament.');
        navigate(isNew ? `/finance/deposit/fixed/wills/${id}` : '/finance/deposit/fixed/wills/overview');
      },
      () => {
        alert.error(isNew ? 'Greška prilikom dodavanja novog testamenta.' : 'Greška prilikom izmjene testamenta.');
      },
    );
  };

  useEffect(() => {
    if (data) {
      reset({
        file_id: data?.file.id,
        subject: data?.subject,
        date_of_birth: new Date(data?.date_of_birth),
        date_of_receipt_si: new Date(data?.date_of_receipt_si),
        date_of_receipt_rs: new Date(data?.date_of_receipt_rs),
        date_of_end: data?.date_of_end ? new Date(data?.date_of_end) : null,
        case_number_rs: data?.case_number_rs,
        case_number_si: data?.case_number_si,
        father_name: data?.father_name,
        jmbg: data?.jmbg,
        id: data?.id,
      });
    }
  }, [data]);

  const disabled = data?.status === 'Zaključen';

  return (
    <FlexColumn gap={20} style={{alignItems: 'stretch'}}>
      <FlexRow gap={8}>
        <Input
          {...register('case_number_si')}
          label="BROJ PREDMETA (SI BROJ):"
          error={errors.case_number_si?.message}
          disabled={disabled}
        />
        <Input
          {...register('case_number_rs')}
          label="BROJ PREDMETA (RS BROJ):"
          error={errors.case_number_rs?.message}
          disabled={disabled}
        />
      </FlexRow>
      <FlexRow gap={8}>
        <Controller
          name="date_of_receipt_si"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM PRIJEMA (SI BROJ):"
              onChange={onChange}
              error={errors.date_of_receipt_si?.message}
              disabled={disabled}
            />
          )}
        />
        <Controller
          name="date_of_receipt_rs"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM PRIJEMA (SI BROJ):"
              onChange={onChange}
              error={errors.date_of_receipt_rs?.message}
              disabled={disabled}
            />
          )}
        />
      </FlexRow>
      <FlexRow gap={8}>
        <Input
          {...register('subject')}
          label="IME I PREZIME TESTATORA:"
          error={errors.subject?.message}
          disabled={disabled}
        />
        <Input {...register('father_name')} label="IME OCA:" error={errors.father_name?.message} disabled={disabled} />
      </FlexRow>
      <FlexRow gap={8}>
        <div style={{width: '100%'}}>
          <Controller
            name="date_of_birth"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM ROĐENJA:"
                onChange={onChange}
                error={errors.date_of_birth?.message}
                disabled={disabled}
              />
            )}
          />
        </div>
        <Input {...register('jmbg')} label="JMBG:" error={errors.jmbg?.message} disabled={disabled} />
      </FlexRow>
      <div style={{width: '50%'}}>
        <Controller
          name="date_of_end"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM ZAKLJUČENJA:"
              onChange={onChange}
              error={errors.date_of_end?.message}
              disabled={isNew || disabled}
            />
          )}
        />
      </div>
      <Input
        {...register('description')}
        textarea={true}
        label="OPIS:"
        error={errors.description?.message}
        disabled={disabled}
      />

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
            onClick={() => navigate('/finance/deposit/fixed/wills/overview')}
          />
          <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSaving} />
        </Footer>
      )}
    </FlexColumn>
  );
};

export default WillForm;
