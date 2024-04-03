import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, FileUpload, Input, Table, TableHead, Typography} from 'client-library';
import {useEffect, useMemo} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import useGetOrderList from '../../../../services/graphQL/orders/useGetOrders.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import {FileUploadWrapper} from '../../../../shared/FileUploadWrapper.ts';
import {FlexColumn, FlexRow} from '../../../../shared/flex.ts';
import Footer from '../../../../shared/footer.ts';
import {invoiceAmountTableHeads} from '../constants';
import {Amount, InvoiceAmount, InvoiceEntryForm, Row} from './styles';
import {invoiceTypeOptions} from './types.ts';

const invoiceSchema = yup.object().shape({
  id: yup.number().nullable(),
  invoice_number: yup.string().required('Broj računa je obavezan.'),
  supplier_id: yup
    .object({
      id: yup.number().required(),
      title: yup.string().required(),
      bank_accounts: yup.array().of(yup.string().required()).required(),
    })
    .required('Dobavljač je obavezan.'),
  order_id: yup
    .object({
      id: yup.number().required(),
      title: yup.string().required(),
    })
    .required('Narudžbenica je obavezna.'),
  date_of_invoice: yup.date().required('Datum računa je obavezan.'),
  receipt_date: yup.date().required('Datum prijema računa je obavezan.'),
  sss_invoice_receipt_date: yup.date().required('Datum prijema računa SSS je obavezan.'),
  bank_account: yup
    .object({
      id: yup.string().required(),
      title: yup.string().required(),
    })
    .nullable()
    .required('Žiro račun je obavezan.'),
  date_of_payment: yup.date().required('Datum valute je obavezan.'),
  description: yup.string(),
  invoice_type: yup
    .object()
    .shape({
      id: yup.string().required(),
      title: yup.string().required(),
    })
    .required('Tip računa je obavezan.'),
  file_id: yup.number().nullable(),
  articles: yup.array().of(
    yup.object().shape({
      id: yup.number().required(),
      title: yup.string().required(),
      amount: yup.number().required(),
      price: yup.number().required(),
      total_price: yup.number().required(),
      // * PDV is calculated from the price and total price
      pdv: yup.number().required(),
      description: yup.string().optional(),
      account: yup
        .object({
          id: yup.number().required(),
          title: yup.string().required(),
        })
        .required('Konto je obavezan.')
        .nullable(),
    }),
  ),
});

type InvoiceEntryForm = yup.InferType<typeof invoiceSchema>;

const InvoiceEntry = () => {
  const {control, register, handleSubmit, reset, watch, setValue} = useForm<InvoiceEntryForm>({
    resolver: yupResolver(invoiceSchema),
  });

  const {fields, append} = useFieldArray({name: 'articles', control});

  const [selectedOrderOption, invoiceType, invoice_number, date_of_invoice, receipt_date] = watch([
    'order_id',
    'invoice_type',
    'invoice_number',
    'date_of_invoice',
    'receipt_date',
  ]);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const {suppliers} = useGetSuppliers({});
  const {orders} = useGetOrderList({supplier_id: watch('supplier_id')?.id});
  const {counts} = useGetCountOverview({});

  useEffect(() => {
    // * When order is selecred, invoice number, date of invoice, receipt date and articles are set from its values
    if (selectedOrderOption) {
      const selectedOrder = orders.find(order => order.id === selectedOrderOption.id)!;

      if (selectedOrder.invoice_number) setValue('invoice_number', selectedOrder.invoice_number);
      if (selectedOrder.invoice_date) setValue('date_of_invoice', new Date(selectedOrder.invoice_date));
      if (selectedOrder.date_system) setValue('receipt_date', new Date(selectedOrder.date_system));

      if (selectedOrder.articles && selectedOrder.articles.length) {
        for (const article of selectedOrder.articles) {
          append({
            id: article.id,
            title: article.title,
            amount: article.amount,
            price: article.price,
            total_price: article.total_price,
            pdv:
              article.price && article.total_price ? (article.price / (article.total_price - article.price)) * 100 : 0,
            description: article.description,
            account: null,
          });
        }
      }
    }
  }, [selectedOrderOption]);

  const invoiceTableHeads: TableHead[] = useMemo(() => {
    const isManual = invoiceType?.id === 'manual';

    return [
      {title: 'Naziv stavke', accessor: 'title'},
      {
        title: 'Neto iznos',
        accessor: 'price',
        type: 'custom',
        renderContents: (price: number, row) => {
          if (isManual) {
            return <Input {...register(`articles.${row.id}.price`)} type="number" />;
          } else {
            return <Typography content={price || '0'} />;
          }
        },
      },
      {
        title: 'PDV',
        accessor: 'pdv',
        type: 'custom',
        renderContents: (pdv: number, row) => {
          if (isManual) {
            return <Input {...register(`articles.${row.id}.pdv`)} type="number" />;
          } else {
            return <Typography content={pdv || '0'} />;
          }
        },
      },
      {
        title: 'Ukupan iznos',
        accessor: 'total_price',
        type: 'custom',
        renderContents: (totalPrice: number, row) => {
          if (isManual) {
            return <Input {...register(`articles.${row.id}.total_price`)} type="number" />;
          } else {
            return <Typography content={totalPrice || '0'} />;
          }
        },
      },
      {title: 'Opis', accessor: 'description'},
      {
        title: 'Konto',
        accessor: 'account',
        type: 'custom',
        renderContents: (_, row) => (
          <Controller
            name={`articles.${row.id}.account`}
            control={control}
            render={({field: {onChange, name, value}}) => (
              <Dropdown options={counts} name={name} value={value} onChange={onChange} />
            )}
          />
        ),
      },
      {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
    ];
  }, [selectedOrderOption, invoiceType]);

  const totalNet = useMemo(() => fields.reduce((acc, field) => (acc += field.price), 0), [fields]);
  const totalGross = useMemo(() => fields.reduce((acc, field) => (acc += field.total_price), 0), [fields]);

  const supplierBankAccounts = suppliers.find(supplier => supplier.id === watch('supplier_id')?.id)?.bank_accounts;

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
            name="supplier_id"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="DOBAVLJAČ:"
                placeholder={'Odaberite ime dobavljača'}
                options={suppliers}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name="order_id"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="NARUDŽBENICA:"
                placeholder={'Odaberite narudžbenicu'}
                options={orders.map(order => ({id: order.id, title: order.invoice_number}))}
                isDisabled={invoiceType?.id === 'manual'}
              />
            )}
          />
          <Input
            {...register('invoice_number')}
            label="BROJ RAČUNA:"
            placeholder="Unesite broj računa"
            disabled={Boolean(selectedOrderOption) && Boolean(invoice_number)}
          />
        </Row>

        {/* TODO: This date is being added by the accountant of SSS */}
        {/* Flex row shared flex component is being tested here */}
        <FlexRow gap="0.5rem" justify="between" style={{marginBottom: 25}} stretchChildren>
          <Controller
            name={'date_of_invoice'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM RAČUNA:"
                onChange={onChange}
                disabled={Boolean(selectedOrderOption) && date_of_invoice}
              />
            )}
          />
          <Controller
            name={'receipt_date'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PRIJEMA ROBE:"
                onChange={onChange}
                disabled={Boolean(selectedOrderOption) && receipt_date}
              />
            )}
          />
          <Controller
            name={'sss_invoice_receipt_date'}
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
        </FlexRow>
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
            name={'bank_account'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="ŽIRO RAČUN:"
                placeholder={'Odaberite broj računa'}
                options={
                  supplierBankAccounts
                    ? supplierBankAccounts.map((account: string) => ({id: account, title: account}))
                    : []
                }
              />
            )}
          />
          <Controller
            name={'date_of_payment'}
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
          <Input {...register('description')} label="OPIS:" textarea placeholder="Unesite opis" />
        </Row>

        <Table tableHeads={invoiceTableHeads} data={fields} />

        {selectedOrderOption && fields.length && (
          <FlexColumn style={{marginTop: '1rem'}}>
            <Amount>
              <Typography style={{fontWeight: 600}} variant="bodySmall" content="NETO IZNOS:" />
              <Typography variant="bodySmall" content={`${totalNet}e`} />
            </Amount>
            <Amount>
              <Typography style={{fontWeight: 600}} variant="bodySmall" content="PDV:" />
              <Typography variant="bodySmall" content={`${fields[0]?.pdv}e`} />
            </Amount>
            <Amount>
              <Typography style={{fontWeight: 600}} variant="bodySmall" content="UKUPAN IZNOS:" />
              <Typography variant="bodySmall" content={`${totalGross}e`} />
            </Amount>
            <InvoiceAmount>
              <Typography variant="bodySmall" content="INVOICE AMOUNT BY KONTO" />
            </InvoiceAmount>
          </FlexColumn>
        )}

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
