import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import {CONFISCATED_PROPERTY_TYPES_SETTINGS} from '../../screens/deposit/fixedDeposit/constants';
import useInsertDepositDispatch from '../../services/graphQL/fixedDeposits/useInsertDepositDispatch';
import useGetSettings from '../../services/graphQL/getSettings/useGetSettings';
import useGetJudges from '../../services/graphQL/judges/useGetJudges';
import {FormGroup} from '../../shared/form';
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
  type: yup.string(),
  amount: yup.string().required(requiredError),
  currency: optionsStringSchema.when('type', {
    is: 'financial',
    then: schema => schema.required(requiredError),
  }),
  unit: yup.string().when('type', {
    is: 'material',
    then: schema => schema.required(requiredError),
  }),
  type_id: optionsNumberSchema.when('type', {
    is: 'material',
    then: schema => schema.required(requiredError),
  }),
  category_id: optionsNumberSchema.when('type', {
    is: 'material',
    then: schema => schema.required(requiredError),
  }),
  serial_number: yup.string().when('type', {
    is: 'material',
    then: schema => schema.required(requiredError),
  }),
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

  const type = useMemo(() => {
    const pathnameSegments = pathname.split('/');
    return pathnameSegments[pathnameSegments.length - 2];
  }, [pathname]);

  const deposit_id = pathname.split('/').pop();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    control,
    watch,
    setValue,
  } = useForm<DepositDispatchSchemaType>({resolver: yupResolver(depositDispatchSchema)});

  const category = watch('category_id');

  const {insertDepositDispatch} = useInsertDepositDispatch();
  const {judges} = useGetJudges({});

  const {data: confiscationCategories} = useGetSettings({entity: CONFISCATED_PROPERTY_TYPES_SETTINGS});
  const {data: confiscationTypes} = useGetSettings({
    entity: CONFISCATED_PROPERTY_TYPES_SETTINGS,
    parent_id: category?.id,
  });

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: DepositDispatchSchemaType) => {
    const payload = {
      unit: data.unit,
      action: data.action,
      serial_number: data.serial_number,
      amount: parseFloat(data.amount),
      date_of_action: parseDateForBackend(data.date_of_action) as string,
      file_id: data.file_id ? data.file_id : null,
      currency: data.currency?.id,
      deposit_id: parseInt(deposit_id as string),
      judge_id: data.judge_id.id,
      id: isNew ? null : data.id,
      case_number: data.case_number,
      category_id: data.category_id?.id ? data.category_id.id : null,
      type_id: data.type_id?.id ? data.type_id.id : null,
      subject: data.subject,
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
        type,
        unit: data.unit,
        serial_number: data.serial_number,
        type_id: data.type.id ? data.type : null,
        category_id: data.category.id ? data.category : null,
        id: data.id,
        file_id: data.file.id,
        judge_id: data.judge,
        date_of_action: new Date(data.date_of_action),
        currency: currencies.find((currency: DropdownData<string>) => currency.id === data.currency),
        amount: data.amount.toString(),
        subject: data.subject,
        case_number: data.case_number,
        action: data.action,
      });
    }
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'KREIRAJ POVRAT DEPOZITA' : 'UREDI POVRAT DEPOZITA'}
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(onSubmit)}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      content={
        <div>
          {type === 'financial' && (
            <FormGroup style={{marginBottom: 15}}>
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
            </FormGroup>
          )}
          {type === 'material' && (
            <>
              <FormGroup style={{marginBottom: 15}}>
                <Controller
                  control={control}
                  name="category_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={value => {
                        onChange(value);
                        setValue('type_id', null);
                      }}
                      label="KATEGORIJA:"
                      options={confiscationCategories.items}
                      error={errors.category_id?.message}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup style={{marginBottom: 15}}>
                <Controller
                  control={control}
                  name="type_id"
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      label="VRSTA:"
                      options={confiscationTypes.items}
                      error={errors.type_id?.message}
                      isDisabled={!category}
                    />
                  )}
                />
              </FormGroup>
            </>
          )}
          {type === 'material' && (
            <FormGroup>
              <Input {...register('unit')} label="JEDINICA:" error={errors.amount?.message} />
            </FormGroup>
          )}
          <FormGroup style={{marginBottom: 15}}>
            <Input
              {...register('amount')}
              label={type === 'material' ? 'KOLIČINA' : 'IZNOS'}
              error={errors.amount?.message}
            />
          </FormGroup>
          {type === 'material' && (
            <FormGroup style={{marginBottom: 15}}>
              <Input {...register('serial_number')} label="SERIJSKI BROJ:" error={errors.serial_number?.message} />
            </FormGroup>
          )}
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
          <FormGroup style={{marginBottom: 15}}>
            <Input {...register('case_number')} label="BROJ AKTA:" error={errors.case_number?.message} />
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
          <FormGroup style={{marginBottom: 15}}>
            <Input {...register('action')} label="NAČIN VRAĆANJA:" error={errors.action?.message} />
          </FormGroup>
          <FormGroup style={{marginBottom: 15}}>
            <Input {...register('subject')} label="PRIMALAC:" error={errors.subject?.message} />
          </FormGroup>

          <div style={{marginTop: 25}}>
            <FileUpload
              icon={null}
              files={uploadedFiles}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Dodaj fajl" />}
              buttonText="Učitaj"
            />
            <FileList files={data?.file.id ? [data.file] : null} />
          </div>
        </div>
      }
    />
  );
};

export default DepositDispatchModal;
