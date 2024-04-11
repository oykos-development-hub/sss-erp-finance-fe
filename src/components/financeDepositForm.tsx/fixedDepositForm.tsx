import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, FileUpload, Input, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useGetCountOverview from '../../services/graphQL/counts/useGetCountOverview';
import useGetFixedDeposits from '../../services/graphQL/fixedDeposits/useGetFixedDeposits';
import useInsertFixedDeposit from '../../services/graphQL/fixedDeposits/useInsertFixedDeposit';
import {FlexColumn, FlexRow} from '../../shared/flex';
import Footer from '../../shared/footer';
import {FixedDeposit} from '../../types/graphQL/fixedDeposits';
import {parseDateForBackend} from '../../utils/dateUtils';
import {optionsNumberSchema} from '../../utils/formSchemas';
import FileList from '../fileList/fileList';

const fixedDepositSchema = yup.object({
  case_number: yup.string().required(requiredError),
  subject: yup.string().required(requiredError),
  account_id: optionsNumberSchema,
  date_of_recipiet: yup.date().required(requiredError).default(null),
  date_of_case: yup.date().required(requiredError).default(null),
  date_of_end: yup.date().nullable().default(null),
  file_id: yup.number().nullable().default(null),
});

type FixedDepositForm = yup.InferType<typeof fixedDepositSchema>;

const FixedDepositForm = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    contextMain: {organization_unit_id},
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
  } = useForm<FixedDepositForm>({
    resolver: yupResolver(fixedDepositSchema),
  });

  const {data: currentDeposit} = useGetFixedDeposits({
    id: id ? parseInt(id) : null,
    organization_unit_id,
    type: 'financial',
  });

  const {counts} = useGetCountOverview({});

  const {insertFixedDeposit} = useInsertFixedDeposit();

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: FixedDepositForm) => {
    const payload = {
      ...data,
      account_id: data.account_id?.id,
      date_of_recipiet: parseDateForBackend(data.date_of_recipiet) as string,
      date_of_case: parseDateForBackend(data.date_of_case) as string,
      date_of_end: parseDateForBackend(data.date_of_end) as string,
      organization_unit_id,
      type: 'financial',
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
        alert.success(isNew ? 'Uspešno ste dodali novi depozit' : 'Uspešno ste izmjenili depozit');
        if (isNew) {
          navigate(`/finance/deposit/fixed/financial/${data.id}`);
        }
      },
      () => {
        alert.error(isNew ? 'Greška prilikom dodavanja novog depozita' : 'Greška prilikom izmjene depozita');
      },
    );
  };

  useEffect(() => {
    if (currentDeposit?.items[0] && !isNew) {
      reset({
        file_id: currentDeposit?.items[0].file.id,
        case_number: currentDeposit?.items[0].case_number,
        subject: currentDeposit?.items[0].subject,
        account_id: currentDeposit?.items[0].account,
        date_of_recipiet: new Date(currentDeposit?.items[0].date_of_recipiet),
        date_of_case: new Date(currentDeposit?.items[0].date_of_case),
        date_of_end: currentDeposit?.items[0].date_of_end ? new Date(currentDeposit?.items[0].date_of_end) : null,
      });
    }
  }, [currentDeposit]);

  return (
    <FlexColumn gap={20} style={{alignItems: 'stretch'}}>
      <FlexRow gap={8}>
        <Input {...register('case_number')} label="BROJ PREDMETA:" error={errors.case_number?.message} />
        <Input {...register('subject')} label="IME I PREZIME STRANKE:" error={errors.subject?.message} />
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
            />
          )}
        />
      </FlexRow>
      <FlexRow gap={8}>
        <Controller
          name="account_id"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              value={value}
              onChange={onChange}
              name={name}
              options={counts}
              label="KONTO"
              error={errors.account_id?.message}
            />
          )}
        />
        <div>
          <Controller
            name="date_of_end"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PREDMETA"
                onChange={onChange}
                error={errors.date_of_end?.message}
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
        <FileList files={currentDeposit?.items[0]?.file.id ? [currentDeposit?.items[0]?.file] : null} />
      </div>

      <Footer>
        <Button content="Odustani" variant="secondary" onClick={() => navigate('/finance/deposit/fixed/financial')} />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
      </Footer>
    </FlexColumn>
  );
};

export default FixedDepositForm;
