import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import {CONFISCATED_PROPERTY_TYPES_SETTINGS} from '../../screens/deposit/fixedDeposit/constants';
import useInsertFixedDepositItem from '../../services/graphQL/fixedDeposits/useInsertDepositItem';
import useGetSettings from '../../services/graphQL/getSettings/useGetSettings';
import useGetJudges from '../../services/graphQL/judges/useGetJudges';
import {FormGroup} from '../../shared/form';
import {DropdownData} from '../../types/dropdownData';
import {DepositConfiscation} from '../../types/graphQL/fixedDeposits';
import {parseDateForBackend} from '../../utils/dateUtils';
import {optionsNumberSchema, optionsStringSchema} from '../../utils/formSchemas';
import FileList from '../fileList/fileList';

type DepositConfiscationModalProps = {
  open: boolean;
  onClose: () => void;
  data: DepositConfiscation | null;
  refetch: () => void;
};

const depositConfiscationSchema = yup.object({
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
  category_id: optionsNumberSchema.when('type', {
    is: 'material',
    then: schema => schema.required(requiredError),
  }),
  type_id: optionsNumberSchema.when('type', {
    is: 'material',
    then: schema => schema.required(requiredError),
  }),
  serial_number: yup.string(),
  date_of_confiscation: yup.date().required(requiredError).default(null),
  judge_id: optionsNumberSchema.required(requiredError),
  file_id: yup.number().nullable().default(null),
  id: yup.number().nullable().default(null),
});

type DepositConfiscationSchemaType = yup.InferType<typeof depositConfiscationSchema>;

const DepositConfiscationModal = ({open, onClose, data, refetch}: DepositConfiscationModalProps) => {
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
  } = useForm<DepositConfiscationSchemaType>({resolver: yupResolver(depositConfiscationSchema)});

  const category = watch('category_id');

  const {insertFixedDepositItem} = useInsertFixedDepositItem();
  const {judges} = useGetJudges({});
  const {data: confiscationCategories} = useGetSettings({entity: CONFISCATED_PROPERTY_TYPES_SETTINGS});
  const {data: confiscationTypes} = useGetSettings({
    entity: CONFISCATED_PROPERTY_TYPES_SETTINGS,
    parent_id: category?.id,
  });

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: DepositConfiscationSchemaType) => {
    const payload = {
      unit: data.unit,
      serial_number: data.serial_number,
      amount: parseFloat(data.amount),
      date_of_confiscation: parseDateForBackend(data.date_of_confiscation) as string,
      file_id: data.file_id ? data.file_id : null,
      currency: data.currency?.id,
      deposit_id: parseInt(deposit_id as string),
      judge_id: data.judge_id.id,
      type_id: data.type_id?.id,
      category_id: data.category_id?.id,
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
        type,
        id: data.id,
        file_id: data.file.id,
        judge_id: data.judge,
        unit: data.unit,
        serial_number: data.serial_number,
        category_id: data.category.id ? data.category : null,
        type_id: data.type.id ? data.type : null,
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
          {type === 'financial' ? (
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
          ) : (
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
                      error={errors.category_id?.message}
                      isDisabled={!category}
                    />
                  )}
                />
              </FormGroup>
            </>
          )}
          <FormGroup style={{marginBottom: 15}}>
            {type === 'material' && <Input {...register('unit')} label="JEDINICA:" error={errors.amount?.message} />}
          </FormGroup>
          <FormGroup style={{marginBottom: 15}}>
            <Input
              {...register('amount')}
              label={type === 'financial' ? 'IZNOS' : 'KOLIČINA'}
              error={errors.amount?.message}
            />
          </FormGroup>
          {type === 'material' && (
            <FormGroup style={{marginBottom: 15}}>
              <Input {...register('serial_number')} label="SERIJSKI BROJ:" error={errors.serial_number?.message} />
            </FormGroup>
          )}
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
              style={{marginBottom: 10}}
            />
            <FileList files={data?.file.id ? [data.file] : null} isInModal />
          </div>
        </div>
      }
    />
  );
};

export default DepositConfiscationModal;
