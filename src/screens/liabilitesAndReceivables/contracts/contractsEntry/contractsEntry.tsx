import {ContractsFormContainer, HalfWidthContainer, Row} from './styles.ts';
import Footer from '../../../../shared/footer.ts';
import {Dropdown, Datepicker, Input, Button} from 'client-library';
import {mockDropdownOptions} from '../../../../constants.ts';
import {Controller, useForm} from 'react-hook-form';

const initialValues = {
  subject: null,
  djelovodni_broj: null,
  vrsta_ugovora: null,
  sifarnik_poreske_uprave: null,
  subjekt_koji_je_izdao_rjesenje: null,
  aktivnost: null,
  trajanje_ugovora: null,
  datum_ugovora: null,
  datum_valute: null,
  datum_prijema_racunovodstva: null,
  datum_prijema_racunovodstva_sss: null,
  opis: '',
  iznos_za_uplatu: null,
  prethodna_primanja_u_mjesecu: null,
  neto_iznos: null,
};

const ContractsEntry = () => {
  const {control, register, handleSubmit, reset} = useForm({defaultValues: initialValues});

  const onSubmit = (data: any) => {
    // TODO add sumbit api call
    console.log(data);
  };

  return (
    <ContractsFormContainer>
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
            name="djelovodni_broj"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="DJELOVODNI BROJ:"
                placeholder={'Odaberite djelovodni broj'}
                options={mockDropdownOptions}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'vrsta_ugovora'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="VRSTA UGOVORA:"
                placeholder={'Odaberite vrstu ugovora'}
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
                label={'SUBJEKT KOJI JE IZDAO RJESENJE:'}
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
            name={'trajanje_ugovora'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="TRAJANJE UGOVORA:"
                placeholder={'Odaberite trajanje ugovora'}
                options={mockDropdownOptions}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'datum_ugovora'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM UGOVORA:"
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
            name={'datum_prijema_racunovodstva'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PRIJEMA RAČUNOVODSTVA:"
                onChange={onChange}
              />
            )}
          />
          <Controller
            name={'datum_prijema_racunovodstva_sss'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PRIJEMA RAČUNOVODSTVA SSS:"
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
    </ContractsFormContainer>
  );
};

export default ContractsEntry;
