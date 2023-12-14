import {DecisionsFormContainer, HalfWidthContainer, Row} from './styles.ts';
import {Dropdown, Datepicker, Input, Button} from 'client-library';
import Footer from '../../../../shared/footer.ts';
import {Controller, useForm} from 'react-hook-form';
import {mockDropdownOptions} from '../../../../constants.ts';

const initialValues = {
  subject: null,
  broj_predmeta: null,
  vrsta_rjesenja: null,
  sifarnik_poreske_uprave: null,
  subjekt_koji_je_izdao_rjesenje: null,
  aktivnost: null,
  izvor_finansiranja: null,
  datum_rjesenja: null,
  datum_valute: null,
  datum_prijema_rjesenja: null,
  datum_prijema_rjesenja_sss: null,
  opis: '',
  iznos_za_uplatu: null,
  prethodna_primanja_u_mjesecu: null,
  neto_iznos: null,
};

const DecisionsEntry = () => {
  const {control, register, handleSubmit, reset} = useForm({defaultValues: initialValues});

  const onSubmit = (data: any) => {
    // TODO add sumbit api call
    console.log(data);
  };

  return (
    <DecisionsFormContainer>
      <>
        <Row>
          <Controller
            name="subject"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="SUBJEKT:"
                placeholder={'Odaberite ime subjekta'}
                options={mockDropdownOptions}
              />
            )}
          />
          <Controller
            name="broj_predmeta"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="BROJ PREDMETA:"
                placeholder={'Odaberite broj predmeta'}
                options={mockDropdownOptions}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'vrsta_rjesenja'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="VRSTA RJEŠENJA:"
                placeholder={'Odaberite vrstu rešenja'}
                options={mockDropdownOptions}
              />
            )}
          />
          <Controller
            name={'sifarnik_poreske_uprave'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="ŠIFARNIK PORESKE UPRAVE:"
                placeholder={'Odaberite šifarnik'}
                options={mockDropdownOptions}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'subjekt_koji_je_izdao_rjesenje'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label={'SUBJEKT KOJI JE IZDAO RJEŠENJE:'}
                placeholder={'Odaberite subjekt'}
                options={mockDropdownOptions}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'aktivnost'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="AKTIVNOST:"
                placeholder={'Odaberite aktivnost'}
                options={mockDropdownOptions}
              />
            )}
          />
          <Controller
            name={'izvor_finansiranja'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="IZVOR FINANSIRANJA:"
                placeholder={'Odaberite izvor finansiranja'}
                options={mockDropdownOptions}
              />
            )}
          />
        </Row>
        <Row>
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
          <Controller
            name={'datum_valute'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM VALUTE:"
                onChange={onChange}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'datum_prijema_rjesenja'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PRIJEMA RJEŠENJA:"
                onChange={onChange}
              />
            )}
          />
          <Controller
            name={'datum_prijema_rjesenja_sss'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PRIJEMA RJEŠENJA SSS:"
                onChange={onChange}
              />
            )}
          />
        </Row>
        <Row>
          <Input {...register('opis')} label="OPIS:" textarea placeholder="Unesite opis" />
        </Row>
        <HalfWidthContainer>
          <Row>
            <Input
              {...register('iznos_za_uplatu')}
              label="IZNOS ZA UPLATU:"
              placeholder="Unesite iznos"
              type={'number'}
              inputMode={'decimal'}
              leftContent={<div>€</div>}
            />
            <Input
              {...register('prethodna_primanja_u_mjesecu')}
              label="PRETHODNA PRIMANJA U MJESECU:"
              placeholder="Unesite prethodna primanja"
              type={'number'}
              inputMode={'decimal'}
              leftContent={<div>€</div>}
            />
          </Row>
          <HalfWidthContainer>
            <Row>
              <Input
                {...register('neto_iznos')}
                label={'NETO IZNOS:'}
                placeholder={'Unesite neto iznos'}
                type={'number'}
                inputMode={'decimal'}
                leftContent={<div>€</div>}
              />
            </Row>
          </HalfWidthContainer>
          <Button content="Obračunaj" variant={'primary'} onClick={handleSubmit(onSubmit)} />
        </HalfWidthContainer>
        <Footer>
          <Button content="Obriši" variant="secondary" onClick={() => reset()} />
        </Footer>
      </>
    </DecisionsFormContainer>
  );
};

export default DecisionsEntry;
