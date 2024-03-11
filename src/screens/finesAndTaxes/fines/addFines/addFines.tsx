import {Controller, useForm} from 'react-hook-form';
import {FinesFormContainer, Row, Amount, LabeledDivider} from './styles.ts';
import {mockDropdownOptions} from '../../../../constants.ts';
import {Dropdown, Datepicker, Input, Button, Typography, Table} from 'client-library';
import {useEffect} from 'react';
import Footer from '../../../../shared/footer.ts';
import {tableHeadsAddFines} from '../constants.tsx';

const initialValues = {
  vrsta_akta: null,
  potkategorija_akta: null,
  broj_resenja: null,
  datum_rjesenja: null,
  subjekat: null,
  jmbg: null,
  prebivaliste: null,
  visina_kazne: 0,
  dvije_trecine_kazne: 0,
  poziv_na_broj_odobrenja: null,
  poziv_na_broj_zaduzenja: null,
  konto: null,
  opis_konta: null,
  datum_izvrsnosti: null,
  rok_za_placanje: null,
  opis: null,
};
const AddFines = () => {
  const {control, register, handleSubmit, reset, watch, setValue} = useForm({defaultValues: initialValues});
  const onSubmit = (data: any) => {
    // TODO add submit api call
    console.log(data);
  };

  const visina_kazne = watch('visina_kazne');

  useEffect(() => {
    if (!visina_kazne) return;
    setValue('dvije_trecine_kazne', Math.ceil((visina_kazne * 2) / 3));
  }, [visina_kazne]);

  return (
    <FinesFormContainer>
      <Row>
        <Controller
          name="vrsta_akta"
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Dropdown
              name={name}
              value={value}
              onChange={onChange}
              label="VRSTA AKTA:"
              placeholder={'Odaberite vrstu akta'}
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
        <Input
          {...register('broj_resenja')}
          label="BROJ RJEŠENJA / PRESUDE:"
          type={'number'}
          inputMode={'decimal'}
          leftContent={<div>€</div>}
        />
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
        <Input {...register('subjekat')} label="Subjekat:" />
      </Row>
      <Row>
        <Input {...register('jmbg')} label="JMBG:" />
        <Input {...register('prebivaliste')} label="PREBIVALIŠTE:" />
      </Row>
      <Row>
        <Input
          {...register('visina_kazne')}
          label="VISINA KAZNE:"
          type={'number'}
          inputMode={'decimal'}
          leftContent={<div>€</div>}
        />
        <Input
          {...register('dvije_trecine_kazne')}
          label="2/3 KAZNE:"
          type={'number'}
          inputMode={'decimal'}
          leftContent={<div>€</div>}
        />
      </Row>
      <Row>
        <Input {...register('poziv_na_broj_odobrenja')} label="POZIV NA BROJ ODOBRENJA:" />
        <Input {...register('poziv_na_broj_zaduzenja')} label="POZIV NA BROJ ZADUŽENJA:" />
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
              placeholder={'Odaberite KONTO'}
              options={mockDropdownOptions}
            />
          )}
        />
        <Input {...register('opis_konta')} label="OPIS KONTA:" />
      </Row>
      <Row>
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
        />{' '}
        <Controller
          name={'rok_za_placanje'}
          control={control}
          render={({field: {name, value, onChange}}) => (
            <Datepicker
              name={name}
              selected={value ? new Date(value) : ''}
              label="ROK ZA PLAĆANJE UKUPNE KAZNE:"
              onChange={onChange}
            />
          )}
        />
      </Row>
      <Row>
        <Input {...register('opis')} label="Opis:" textarea />
      </Row>
      <Amount>
        <Typography style={{fontWeight: 600, marginBottom: 10}} variant={'bodySmall'} content={'Platiti do:'} />
        <Typography variant="bodySmall" content="100 €" />
      </Amount>
      <LabeledDivider>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="DETALJI PLAĆANJA:" />
      </LabeledDivider>
      <Table tableHeads={tableHeadsAddFines} data={[]} />
      <Amount>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="UKUPNO:" />
        <Typography variant="bodySmall" content="100 €" />
      </Amount>
      <Amount>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREMAŠEN IZNOS:" />
        <Typography variant="bodySmall" content="100 €" />
      </Amount>
      <LabeledDivider>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="PREGLED PLAĆANJA:" />
      </LabeledDivider>
      <Amount>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="IZREČENA KAZNA:" />
        <Typography variant="bodySmall" content="100 €" />
      </Amount>
      <Amount>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="UPLAĆENA KAZNA:" />
        <Typography variant="bodySmall" content="100 €" />
      </Amount>
      <Amount>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="IZREČENI SUDSKI TROŠKOVI:" />
        <Typography variant="bodySmall" content="100 €" />
      </Amount>
      <Amount>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="UMANJENJE KAZNE:" />
        <Typography variant="bodySmall" content="100 €" />
      </Amount>
      <Amount>
        <Typography style={{fontWeight: 600}} variant="bodySmall" content="UPLAĆENI SUDSKI TROŠKOVI:" />
        <Typography variant="bodySmall" content="100 €" />
      </Amount>
      <Footer>
        <Button content="Odustani" variant="secondary" style={{width: 130}} onClick={() => reset()} />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
      </Footer>
    </FinesFormContainer>
  );
};

export default AddFines;
