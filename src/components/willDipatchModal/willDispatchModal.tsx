import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../constants';
import useAppContext from '../../context/useAppContext';
import {WillStatusType, willDispatchOptions} from '../../screens/deposit/fixedDeposit/wills/constants';
import useGetJudges from '../../services/graphQL/judges/useGetJudges';
import useInsertWillDispatch from '../../services/graphQL/wills/useInsertWillDispatch';
import {FormGroup} from '../../shared/form';
import {DropdownData} from '../../types/dropdownData';
import {WillDispatch} from '../../types/graphQL/wills';
import {parseDateForBackend} from '../../utils/dateUtils';
import {optionsNumberSchema, optionsStringSchema} from '../../utils/formSchemas';
import FileList from '../fileList/fileList';

type WillDispatchModalProps = {
  open: boolean;
  onClose: () => void;
  data: WillDispatch | null;
  refetch: () => void;
  willStatus: WillStatusType;
};

const willDispatchSchema = yup.object({
  judge_id: optionsNumberSchema.required(requiredError),
  date_of_dispatch: yup.date().required(requiredError),
  dispatch_type: optionsStringSchema,
  case_number: yup.string().required(requiredError),
  file_id: yup.number().nullable().default(null),
  id: yup.number().nullable().default(null),
});

type WillDispatchSchemaType = yup.InferType<typeof willDispatchSchema>;

const WillDispatchModal = ({open, onClose, data, refetch, willStatus}: WillDispatchModalProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  const isNew = !data;

  const {
    navigation: {
      location: {pathname},
    },
    fileService: {uploadFile},
    alert,
  } = useAppContext();

  const will_id = pathname.split('/').pop();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    control,
  } = useForm<WillDispatchSchemaType>({resolver: yupResolver(willDispatchSchema)});

  const {insertWillDispatch} = useInsertWillDispatch();
  const {judges} = useGetJudges({});

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const onSubmit = async (data: WillDispatchSchemaType) => {
    const payload = {
      ...data,
      date_of_dispatch: parseDateForBackend(data.date_of_dispatch) as string,
      dispatch_type: willStatus === 'Depozit' ? 'U radu' : 'Depozit',
      will_id: parseInt(will_id),
      judge_id: data.judge_id.id,
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

    await insertWillDispatch(
      payload,
      () => {
        alert.success(isNew ? 'Kretanje testamenta uspješno kreiran!' : 'Kretanje testamenta uspješno izmijenjen!');
        refetch();
        onClose();
      },
      () => {
        alert.error(isNew ? 'Greška pri kreiranju kretanja testamenta!' : 'Greška pri izmjeni kretanja testamenta!');
      },
    );
  };

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        dispatch_type: willDispatchOptions.find((opt: DropdownData<string>) => opt.id === data.dispatch_type),
        judge_id: data.judge,
        date_of_dispatch: new Date(data.date_of_dispatch),
        case_number: data.case_number,
        file_id: data.file.id,
      });
    }
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'KREIRAJ KRETANJE TESTAMENTA' : 'UREDI KRETANJE TESTAMENTA'}
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(onSubmit)}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      content={
        <div>
          {!isNew && (
            <FormGroup style={{marginBottom: 15}}>
              <Controller
                control={control}
                name="dispatch_type"
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    name={name}
                    value={value}
                    onChange={onChange}
                    label="TIP KRETANJA:"
                    options={willDispatchOptions}
                    isDisabled={true}
                  />
                )}
              />
            </FormGroup>
          )}

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
          <Controller
            name="date_of_dispatch"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                onChange={onChange}
                label="DATUM AKTA:"
                error={errors.date_of_dispatch?.message}
                style={{marginBottom: 15}}
              />
            )}
          />
          <FormGroup style={{marginBottom: 15}}>
            <Input {...register('case_number')} label="BROJ AKTA:" error={errors.case_number?.message} />
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
            <FileList files={data?.file.id ? [data.file] : null} isInModal />
          </div>
        </div>
      }
    />
  );
};

export default WillDispatchModal;
