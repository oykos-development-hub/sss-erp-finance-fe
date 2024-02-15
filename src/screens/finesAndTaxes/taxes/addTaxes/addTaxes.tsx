import {Controller, useForm} from 'react-hook-form';
import {FinesFormContainer, Row} from './styles.ts';
import {mockDropdownOptions} from '../../../../constants.ts';
import {Dropdown, Datepicker, Input, Button} from 'client-library';
import Footer from '../../../../shared/footer.ts';

const initialValues = {
  vrsta_takse: null,
  potkategorija_akta: null,
  broj_resenja: null,
  datum_rjesenja: null,
  subjekat: null,
  jmbg: null,
  visina_takse: 0,
  poziv_na_broj_odobrenja: null,
  poziv_na_broj_zaduzenja: null,
  datum_izvrsnosti: null,
  konto: null,
  opis_konta: null,
  opis: null,
};
const AddTaxes = () => {
  const {control, register, handleSubmit, reset} = useForm({defaultValues: initialValues});
  const onSubmit = (data: any) => {
    // TODO add submit api call
    console.log(data);
  };

  return (
    <FinesFormContainer>
      <Row>
        <Controller
          name="vrsta_takse"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="VRSTA TAKSE:"
              placeholder={'Odaberite vrstu takse'}
              options={mockDropdownOptions}
            />
          )}
        />
        <Controller
          name="potkategorija_akta"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="POTKATEGORIJA AKTA:"
              placeholder={'Odaberite potkategoriju akta'}
              options={mockDropdownOptions}
            />
          )}
        />
      </Row>
      <Row>
        <Input {...register('broj_resenja')} label="BROJ RJEŠENJA / PRESUDE:" />
        <Controller
          name={'datum_rjesenja'}
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM RJEŠENJA:"
              onChange={onChange}
            />
          )}
        />
      </Row>
      <Row>
        <Input {...register('subjekat')} label="SUBJEKAT:" />
        <Input {...register('jmbg')} label="JMBG:" />
      </Row>
      <Row>
        <Input {...register('visina_takse')} label="VISINA KAZNE:" type={'number'} />
        <Input {...register('poziv_na_broj_odobrenja')} label="POZIV NA BROJ ODOBRENJA:" />
      </Row>
      <Row>
        <Input {...register('poziv_na_broj_zaduzenja')} label="POZIV NA BROJ ZADUŽENJA:" />
        <Controller
          name={'datum_izvrsnosti'}
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="DATUM IZVRŠOSTI:"
              onChange={onChange}
            />
          )}
        />
      </Row>
      <Row>
        <Controller
          name="konto"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="KONTO:"
              placeholder={'Odaberite konto'}
              options={mockDropdownOptions}
            />
          )}
        />
        <Input {...register('opis_konta')} label="OPIS KONTA:" />
      </Row>
      <Row>
        <Input {...register('opis')} label="Opis:" textarea />
      </Row>
      <Footer>
        <Button content="Odustani" variant="secondary" style={{width: 130}} onClick={() => reset()} />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
      </Footer>
    </FinesFormContainer>
  );
};

export default AddTaxes;
