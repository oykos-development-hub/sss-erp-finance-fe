import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, FileUpload, Input, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {generateDropdownOptions, requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useGetCountOverview from '../../services/graphQL/counts/useGetCountOverview';
import useInsertFixedDeposit from '../../services/graphQL/fixedDeposits/useInsertFixedDeposit';
import {FlexColumn, FlexRow} from '../../shared/flex';
import Footer from '../../shared/footer';
import {FixedDeposit} from '../../types/graphQL/fixedDeposits';
import {parseDateForBackend} from '../../utils/dateUtils';
import {optionsNumberSchema} from '../../utils/formSchemas';
import FileList from '../fileList/fileList';

const financialDepositSchema = yup.object({
  case_number: yup.string().required(requiredError),
  subject: yup.string().required(requiredError),
  account_id: optionsNumberSchema,
  date_of_recipiet: yup.date().required(requiredError).default(null),
  date_of_case: yup.date().required(requiredError).default(null),
  date_of_end: yup.date().nullable().default(null),
  file_id: yup.number().nullable().default(null),
});

type FinancialDepositForm = yup.InferType<typeof financialDepositSchema>;

const FinancialDepositForm = ({data}: {data?: FixedDeposit}) => {
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
  } = useForm<FinancialDepositForm>({
    resolver: yupResolver(financialDepositSchema),
  });

  const {counts} = useGetCountOverview({level: 3});

  const {insertFixedDeposit, loading: isSaving} = useInsertFixedDeposit();

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: FinancialDepositForm) => {
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
        alert.success(
          isNew ? 'Uspešno ste dodali novi finansijski depozit' : 'Uspešno ste izmjenili finansijski depozit',
        );
        if (isNew) {
          navigate(`/finance/deposit/fixed/financial/${data.id}`);
        }
      },
      () => {
        alert.error(
          isNew
            ? 'Greška prilikom dodavanja novog finansijskog depozita'
            : 'Greška prilikom izmjene finansijskog depozita',
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
        account_id: data?.account,
        date_of_recipiet: new Date(data?.date_of_recipiet),
        date_of_case: new Date(data?.date_of_case),
        date_of_end: data?.date_of_end ? new Date(data?.date_of_end) : null,
      });
    }
  }, [data]);

  const disabled = data?.status === 'Zakljucen';

  const dropdownCountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

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
              label="DATUM PRIJEMA AKTA:"
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
              label="DATUM PREDMETA:"
              onChange={onChange}
              error={errors.date_of_case?.message}
              disabled={disabled}
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
              options={dropdownCountsOptions}
              label="KONTO:"
              error={errors.account_id?.message}
              isDisabled={disabled}
            />
          )}
        />
        <div style={{width: '100%'}}>
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
            onClick={() => navigate('/finance/deposit/fixed/financial/overview')}
          />
          <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSaving} />
        </Footer>
      )}
    </FlexColumn>
  );
};

export default FinancialDepositForm;
