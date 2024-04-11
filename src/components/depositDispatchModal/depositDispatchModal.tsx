import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import useInsertDepositDispatch from '../../services/graphQL/fixedDeposits/useInsertDepositDispatch';
import useGetJudges from '../../services/graphQL/judges/useGetJudges';
import {DropdownData} from '../../types/dropdownData';
import {DepositDispatch} from '../../types/graphQL/fixedDeposits';
import {parseDateForBackend} from '../../utils/dateUtils';
import {optionsNumberSchema, optionsStringSchema} from '../../utils/formSchemas';
import FileList from '../fileList/fileList';

type DepositDispatchModal = {
  open: boolean;
  onClose: () => void;
  data: DepositDispatch | null;
  refetch: () => void;
};

const depositDispatchSchema = yup.object({
  amount: yup.string().required(requiredError),
  currency: optionsStringSchema.required(requiredError),
  date_of_action: yup.date().required(requiredError).default(null),
  judge_id: optionsNumberSchema.required(requiredError),
  file_id: yup.number().nullable().default(null),
  id: yup.number().nullable().default(null),
  action: yup.string().required(requiredError),
  subject: yup.string().required(requiredError),
  case_number: yup.string().required(requiredError),
});

type DepositDispatchSchemaType = yup.InferType<typeof depositDispatchSchema>;

const DepositDispatchModal = ({open, onClose, data, refetch}: DepositDispatchModal) => {
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
  } = useForm<DepositDispatchSchemaType>({resolver: yupResolver(depositDispatchSchema)});

  const {insertDepositDispatch} = useInsertDepositDispatch();
  const {judges} = useGetJudges({});

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: DepositDispatchSchemaType) => {
    const payload = {
      ...data,
      amount: parseFloat(data.amount),
      date_of_action: parseDateForBackend(data.date_of_action) as string,
      file_id: data.file_id ? data.file_id : null,
      currency: data.currency.id,
      deposit_id: parseInt(deposit_id as string),
      judge_id: data.judge_id.id,
      id: isNew ? null : data.id,
      case_number: data.case_number,
    };

    if (uploadedFiles?.length) {
      console.log(uploadedFiles);
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

    await insertDepositDispatch(
      payload,
      () => {
        alert.success(isNew ? 'Akcija uspješno kreirana!' : 'Akcija uspješno izmijenjena!');
        refetch();
        onClose();
      },
      () => {
        alert.error(isNew ? 'Greška pri kreiranju akcije!' : 'Greška pri izmjeni akcije!');
      },
    );
  };

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        file_id: data.file.id,
        judge_id: data.judge,
        date_of_action: new Date(data.date_of_action),
        currency: currencies.find((currency: DropdownData<string>) => currency.id === data.currency),
        amount: data.amount.toString(),
        subject: data.subject,
        case_number: data.case_number,
      });
    }
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'KREIRAJ AKCIJU' : 'UREDI AKCIJU'}
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(onSubmit)}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      content={
        <div>
          <div style={{marginBottom: 15}}>
            <Input {...register('action')} label="AKCIJA:" error={errors.action?.message} />
          </div>
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
          <div style={{marginBottom: 15}}>
            <Input {...register('subject')} label="PRIMALAC:" error={errors.subject?.message} />
          </div>
          <Controller
            name="date_of_action"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                onChange={onChange}
                label="DATUM AKTA:"
                error={errors.date_of_action?.message}
                style={{marginBottom: 15}}
              />
            )}
          />
          <div style={{marginBottom: 15}}>
            <Input {...register('case_number')} label="BROJ AKTA:" error={errors.case_number?.message} />
          </div>
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

export default DepositDispatchModal;
