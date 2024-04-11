import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useInsertFixedDepositItem from '../../services/graphQL/fixedDeposits/useInsertDepositItem';
import {DropdownData} from '../../types/dropdownData';
import {DepositConfiscation} from '../../types/graphQL/fixedDeposits';
import {parseDateForBackend} from '../../utils/dateUtils';
import {optionsNumberSchema, optionsStringSchema} from '../../utils/formSchemas';
import FileList from '../fileList/fileList';
import useGetJudges from '../../services/graphQL/judges/useGetJudges';

type FinancialConfiscationModalProps = {
  open: boolean;
  onClose: () => void;
  data: DepositConfiscation | null;
  refetch: () => void;
};

const financialConfiscationSchema = yup.object({
  amount: yup.string().required(requiredError),
  currency: optionsStringSchema.required(requiredError),
  date_of_confiscation: yup.date().required(requiredError).default(null),
  judge_id: optionsNumberSchema.required(requiredError),
  file_id: yup.number().nullable().default(null),
  id: yup.number().nullable().default(null),
});

type FinancialConfiscationSchemaType = yup.InferType<typeof financialConfiscationSchema>;

const FinancialConfiscationModal = ({open, onClose, data, refetch}: FinancialConfiscationModalProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  const isNew = !data;

  const {
    navigation: {
      location: {pathname},
    },
    fileService: {uploadFile},
    currencies,
    alert,
  } = useAppContext();

  const deposit_id = pathname.split('/').pop();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    control,
  } = useForm<FinancialConfiscationSchemaType>({resolver: yupResolver(financialConfiscationSchema)});

  const {insertFixedDepositItem} = useInsertFixedDepositItem();
  const {judges} = useGetJudges({});

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: FinancialConfiscationSchemaType) => {
    const payload = {
      ...data,
      amount: parseFloat(data.amount),
      date_of_confiscation: parseDateForBackend(data.date_of_confiscation) as string,
      file_id: data.file_id ? data.file_id : null,
      currency: data.currency.id,
      deposit_id,
      judge_id: data.judge_id.id,
      id: isNew ? null : data.id,
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

    await insertFixedDepositItem(
      payload,
      () => {
        alert.success(isNew ? 'Depozit uspješno kreiran!' : 'Depozit uspješno izmijenjen!');
        refetch();
        onClose();
      },
      () => {
        alert.error(isNew ? 'Greška pri kreiranju depozita!' : 'Greška pri izmjeni depozita!');
      },
    );
  };

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        file_id: data.file.id,
        judge_id: data.judge,
        date_of_confiscation: new Date(data.date_of_confiscation),
        currency: currencies.find((currency: DropdownData<string>) => currency.id === data.currency),
        amount: data.amount.toString(),
      });
    }
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'KREIRAJ DEPOZIT' : 'UREDI DEPOZIT'}
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(onSubmit)}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      content={
        <div>
          <div style={{marginBottom: 15}}>
            <Input {...register('amount')} label="KOLIČINA:" error={errors.amount?.message} />
          </div>
          <div style={{marginBottom: 15}}>
            <Controller
              control={control}
              name="currency"
              render={({field: {name, value, onChange}}) => (
                <Dropdown
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="VALUTA:"
                  options={currencies}
                  error={errors.currency?.message}
                />
              )}
            />
          </div>
          <Controller
            name="date_of_confiscation"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                onChange={onChange}
                label="DATUM ODUZIMANJA:"
                error={errors.date_of_confiscation?.message}
                style={{marginBottom: 15}}
              />
            )}
          />
          <div style={{marginBottom: 25}}>
            <Controller
              name="judge_id"
              control={control}
              render={({field: {name, value, onChange}}) => (
                <Dropdown
                  name={name}
                  value={value}
                  onChange={onChange}
                  label="SUDIJA:"
                  options={judges}
                  error={errors.judge_id?.message}
                />
              )}
            />
          </div>

          <div>
            <FileUpload
              icon={null}
              files={uploadedFiles}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Dodaj fajl" />}
              buttonText="Učitaj"
            />
            <FileList files={data?.file ? [data.file] : null} />
          </div>
        </div>
      }
    />
  );
};

export default FinancialConfiscationModal;
