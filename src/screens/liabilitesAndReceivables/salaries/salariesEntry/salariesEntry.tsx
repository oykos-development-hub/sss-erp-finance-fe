import {SalariesFormContainer, Row, FileUploadStepTitle} from './styles.ts';
import Footer from '../../../../shared/footer.ts';
import {Dropdown, Datepicker, Input, Button, FileUpload, Typography} from 'client-library';
import {FileUploadWrapper} from '../../../../shared/FileUploadWrapper.ts';
import {mockDropdownOptions} from '../../../../constants.ts';
import {Controller, useForm} from 'react-hook-form';

const initialValues = {
  aktivnost: null,
  mjesec: null,
  datum_obracuna: null,
  opis: '',
};
const SalariesEntry = () => {
  const {control, register, handleSubmit, reset} = useForm({defaultValues: initialValues});

  const onSubmit = (data: any) => {
    // TODO add sumbit api call
    console.log(data);
  };

  return (
    <SalariesFormContainer>
      <>
        <Row>
          <Controller
            name="aktivnost"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="AKTIVNOST"
                placeholder={'Odaberite aktivnost'}
                options={mockDropdownOptions}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'mjesec'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="MJESEC:"
                placeholder={'Odaberite mjesec'}
                options={mockDropdownOptions}
              />
            )}
          />
          <Controller
            name={'datum_obracuna'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM OBRAČUNA:"
                onChange={onChange}
              />
            )}
          />
        </Row>
        <Row>
          <Input {...register('opis')} label="OPIS:" textarea placeholder="Unesite opis" />
        </Row>
        <Row>
          <FileUploadStepTitle variant="bodyMedium" content="STEP 1: UVEZI REKAPITULACIJU MJESEČNE ZARADE" />
        </Row>
        <FileUploadWrapper>
          <FileUpload
            icon={<></>}
            variant="secondary"
            onUpload={e => console.log(e)}
            note={<Typography variant="bodySmall" content="UVEZI REKAPITULACIJU MJESEČNE ZARADE" />}
            buttonText="UČITAJ FAJL"
          />
        </FileUploadWrapper>
        <Row>
          <FileUploadStepTitle variant="bodyMedium" content="STEP 2: UVEZI REKAPITULACIJU REKAPITULACIJU ZARADA" />
        </Row>
        <FileUploadWrapper>
          <FileUpload
            icon={<></>}
            variant="secondary"
            onUpload={e => console.log(e)}
            note={<Typography variant="bodySmall" content="UVEZI REKAPITULACIJU OBUSTAVA ZARADA" />}
            buttonText="UČITAJ FAJL"
          />
        </FileUploadWrapper>
        <Footer>
          <Button content="Obriši" variant="secondary" onClick={() => reset()} />
          <Button content="Nastavi" variant="primary" onClick={handleSubmit(onSubmit)} />
        </Footer>
      </>
    </SalariesFormContainer>
  );
};

export default SalariesEntry;
