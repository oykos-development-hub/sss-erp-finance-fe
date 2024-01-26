import {invoiceAmountTableHeads, invoiceEntryTableHeads} from '../constants';
import {Amount, InvoiceAmount, InvoiceEntryForm, Row} from './styles';
import {Dropdown, Datepicker, FileUpload, Typography, Input, Table, Button} from 'client-library';
import Footer from '../../../../shared/footer.ts';
import {FileUploadWrapper} from '../../../../shared/FileUploadWrapper.ts';
import {Controller, useForm} from 'react-hook-form';
import {invoiceTypeOptions, mockDropdownOptions} from '../../../../constants.ts';

const initialValues = {
  dobavljac: null,
  aktivnost: null,
  broj_racuna: null,
  datum_racuna: null,
  datum_prijema_racuna_oj: null,
  datum_prijema_racuna_sss: null,
  ziro_racun: null,
  datum_valute: null,
  opis: '',
  invoice_type: {id: 1, title: 'Ručni unos'},
};
const InvoiceEntry = () => {
  const {control, register, handleSubmit, reset, watch} = useForm({defaultValues: initialValues});

  const onSubmit = (data: any) => {
    // TODO add sumbit api call
    console.log(data);
  };

  const invoiceType = watch('invoice_type').id;
  return (
    <InvoiceEntryForm>
      <>
        <Row>
          <Controller
            name="invoice_type"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="TIP RAČUNA:"
                placeholder={'Odaberite tip računa'}
                options={invoiceTypeOptions}
              />
            )}
          />
          <Controller
            name="dobavljac"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="DOBAVLJAČ:"
                placeholder={'Odaberite ime dobavljača'}
                options={mockDropdownOptions}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name="dobavljac"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="NARUDŽBENICA:"
                placeholder={'Odaberite narudžbenicu'}
                options={[]}
                isDisabled={invoiceType === 1}
              />
            )}
          />
          <Controller
            name={'datum_racuna'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM RAČUNA:"
                onChange={onChange}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'datum_prijema_racuna_oj'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PRIJEMA RAČUNA OJ:"
                onChange={onChange}
              />
            )}
          />
          <Controller
            name={'datum_prijema_racuna_sss'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PRIJEMA RAČUNA SSS:"
                onChange={onChange}
              />
            )}
          />
        </Row>
        <FileUploadWrapper>
          <FileUpload
            icon={<></>}
            variant="secondary"
            onUpload={() => console.log('upload')}
            note={<Typography variant="bodySmall" content="Prilog dokumenta" />}
            buttonText="Učitaj fajl"
          />
        </FileUploadWrapper>
        <Row>
          <Controller
            name={'ziro_racun'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="ŽIRO RAČUN:"
                placeholder={'Odaberite broj računa'}
                options={mockDropdownOptions}
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
          <Input {...register('opis')} label="OPIS:" textarea placeholder="Unesite opis" />
        </Row>
        <Table tableHeads={invoiceEntryTableHeads} data={[]} />
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="NETO IZNOS:" />
          <Typography variant="bodySmall" content="324e" />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="PDV:" />
          <Typography variant="bodySmall" content="4,5e" />
        </Amount>
        <Amount>
          <Typography style={{fontWeight: 600}} variant="bodySmall" content="UKUPAN IZNOS:" />
          <Typography variant="bodySmall" content="324e" />
        </Amount>
        <InvoiceAmount>
          <Typography variant="bodySmall" content="INVOICE AMOUNT BY KONTO" />
        </InvoiceAmount>
        <Table tableHeads={invoiceAmountTableHeads} data={[]} />
      </>
      <Footer>
        <Button content="Odustani" variant="secondary" style={{width: 130}} onClick={() => reset()} />
        <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} />
      </Footer>
    </InvoiceEntryForm>
  );
};

export default InvoiceEntry;
