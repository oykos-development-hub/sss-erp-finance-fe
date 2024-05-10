import {yupResolver} from '@hookform/resolvers/yup';
import {
  Button,
  Datepicker,
  Dropdown,
  FileUpload,
  Input,
  Table,
  TableHead,
  Theme,
  Typography,
  XIcon,
} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import FileListComponent from '../../../../components/fileList/fileList.tsx';
import {generateDropdownOptions} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import useInsertInvoice from '../../../../services/graphQL/invoice/useInsertInvoice.ts';
import useGetOrderList from '../../../../services/graphQL/orders/useGetOrders.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import {FileUploadWrapper} from '../../../../shared/FileUploadWrapper.ts';
import {FlexRow} from '../../../../shared/flex.ts';
import Footer from '../../../../shared/footer.ts';
import PlusButton from '../../../../shared/plusButton.tsx';
import {FileItem, FileResponseItem} from '../../../../types/fileUploadType.ts';
import {pdvOptions} from '../constants';
import {FileListWrapper} from '../invoicesOverview/styles.ts';
import {invoiceSchema} from './constants.tsx';
import {InvoiceEntryForm, PlusButtonWrapper, Row, StyledSwitch} from './styles';
import {TypeOptions, invoiceTypeOptions} from './types.ts';
import {InvoiceItem} from '../../../../types/graphQL/invoice.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {DropdownData} from '../../../../types/dropdownData.ts';

type InvoiceEntryForm = yup.InferType<typeof invoiceSchema>;

interface InvoiceFormProps {
  invoice?: InvoiceItem;
}

const InvoiceEntry = ({invoice}: InvoiceFormProps) => {
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);
  const [showFileUploadError, setShowFileUploadError] = useState<boolean>(false);
  const [accountingInvoiceFile, setAccountingInvoiceFile] = useState<FileItem | null>(null);
  const [accountingProFormaInvoiceFile, setAccountingProFormaInvoiceFile] = useState<FileItem | null>(null);

  const {
    navigation: {navigate},
    alert,
    fileService: {uploadFile},
    contextMain,
  } = useAppContext();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: {errors},
    setValue,
    reset,
  } = useForm<InvoiceEntryForm>({
    resolver: yupResolver(invoiceSchema),
  });

  const selectedOrderOption = watch('order_id')?.id;

  const [invoiceType, invoice_number, date_of_invoice, receipt_date, pro_forma_invoice_date] = watch([
    'invoice_type',
    'invoice_number',
    'date_of_invoice',
    'receipt_date',
    'pro_forma_invoice_date',
  ]);

  const {fields, append, remove} = useFieldArray({name: 'articles', control});

  const isManual = invoiceType?.id === 'manual';

  const {suppliers} = useGetSuppliers({});
  const {orders} = useGetOrderList({
    supplier_id: watch('supplier_id')?.id,
    finance_overview: true,
    page: 1,
    size: 1000,
  });

  const {counts} = useGetCountOverview({level: 3});
  const {insertInvoice, loading} = useInsertInvoice();

  const supplierBankAccounts = suppliers.find(supplier => supplier.id === watch('supplier_id')?.id)?.bank_accounts;

  const dropdowncountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
    setShowFileUploadError(false);
  };

  const invoiceTableHeads: TableHead[] = useMemo(() => {
    return [
      {
        title: 'Naziv stavke',
        accessor: 'title',
        type: 'custom',
        renderContents: (title: string, _, index) => {
          if (isManual) {
            return (
              <Input
                {...register(`articles.${index}.title`)}
                style={{minWidth: '100px'}}
                error={errors.articles?.[index]?.title?.message}
                disabled={invoice?.status == 'Na nalogu'}
              />
            );
          } else {
            return <Input value={title} disabled />;
          }
        },
      },
      {
        title: 'Neto iznos',
        accessor: 'net_price',
        type: 'custom',
        renderContents: (_item, _row, index) => {
          return (
            <Input
              {...register(`articles.${index}.net_price`)}
              style={{minWidth: '100px'}}
              leftContent={<>Є</>}
              error={errors.articles?.[index]?.net_price?.message}
              disabled={!isManual || invoice?.status == 'Na nalogu'}
            />
          );
        },
      },
      {
        title: 'Stopa PDV-a',
        accessor: 'vat_percentage',
        type: 'custom',
        renderContents: (vat_percentage, _row, index) => {
          console.log(vat_percentage);
          if (isManual) {
            return (
              <Controller
                name={`articles.${index}.vat_percentage`}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <div style={{minWidth: '100px'}}>
                    <Dropdown
                      options={pdvOptions}
                      name={name}
                      value={value as any}
                      onChange={onChange}
                      isDisabled={invoice?.status == 'Na nalogu'}
                    />
                  </div>
                )}
              />
            );
          } else {
            return <Input value={vat_percentage?.title} disabled leftContent={<>%</>} />;
          }
        },
      },
      {
        title: 'PDV',
        accessor: 'vat_price',
        type: 'custom',
        renderContents: (_item, _row, index) => {
          const vatPercentage = watch(`articles.${index}.vat_percentage`);
          const vatPrice = vatPercentage?.id !== 0 ? calculateVatPrice(index) : 0.0;

          return <Input value={vatPrice?.toFixed(2)} disabled leftContent={<>Є</>} />;
        },
      },
      {
        title: 'Količina',
        accessor: 'amount',
        type: 'custom',
        renderContents: (_item, _row, index) => {
          return (
            <Input
              {...register(`articles.${index}.amount`)}
              style={{minWidth: '100px'}}
              error={errors.articles?.[index]?.amount?.message}
              disabled={!isManual || invoice?.status == 'Na nalogu'}
            />
          );
        },
      },
      {
        title: 'Ukupan iznos',
        accessor: '',
        type: 'custom',
        renderContents: (_item, _row, index) => {
          const vatPercentage = watch(`articles.${index}.vat_percentage`);
          const total = vatPercentage ? calculateTotalPrice(index) : 0;

          return <Input value={Number(total)?.toFixed(2)} disabled leftContent={<>Є</>} />;
        },
      },
      {
        title: 'Konto',
        accessor: 'account',
        type: 'custom',
        renderContents: (_item, _row, index) => (
          <Controller
            name={`articles.${index}.account`}
            control={control}
            render={({field: {onChange, name, value}}) => (
              <div style={{minWidth: '200px'}}>
                <Dropdown
                  options={dropdowncountsOptions}
                  name={name}
                  value={value as any}
                  onChange={onChange}
                  error={errors.articles?.[index]?.account?.message}
                  isDisabled={invoice?.status == 'Na nalogu'}
                />
              </div>
            )}
          />
        ),
      },
      {
        title: 'Opis',
        accessor: 'description',
        type: 'custom',
        renderContents: (description: string, _, index) => {
          if (isManual) {
            return (
              <Input
                {...register(`articles.${index}.description`)}
                style={{minWidth: '200px'}}
                disabled={invoice?.status == 'Na nalogu'}
              />
            );
          } else {
            return <Input value={description} disabled textarea />;
          }
        },
      },
      {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
    ];
  }, [invoiceType, register, control, dropdowncountsOptions]);

  const calculateTotalPrice = (index: number) => {
    const net_price = watch('articles')?.[index].net_price;
    const amount = watch('articles')?.[index].amount;
    const vat_percentage = watch('articles')?.[index]?.vat_percentage?.id;
    const totalPrice =
      amount && net_price && vat_percentage && vat_percentage !== 0
        ? net_price * (1 + vat_percentage / 100) * amount
        : net_price && amount && net_price * amount;
    return totalPrice;
  };

  const calculateVatPrice = (index: number) => {
    const net_price = watch('articles')?.[index]?.net_price;
    const vat_percentage = watch('articles')?.[index]?.vat_percentage;
    const vatPrice = net_price && vat_percentage?.id ? net_price * (vat_percentage?.id / 100) : 0;
    return vatPrice;
  };

  const handleAddRow = () => {
    append({
      id: 0,
      title: '',
      net_price: 0,
      vat_price: 0,
      description: '',
      account: null,
      vat_percentage: null,
      amount: 1,
    });
  };

  const onSubmit = async (data: any) => {
    if (loading) return;

    if (uploadedFile) {
      setShowFileUploadError(false);

      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(formData, (files: FileResponseItem[]) => {
        setUploadedFile(null);
        const payload = {
          id: data?.id,
          supplier_id: data?.supplier_id?.id,
          order_id: selectedOrderOption,
          is_invoice: data.is_invoice.id,
          file_id: type.id === true ? files[0].id : null,
          pro_forma_invoice_file_id: type.id === false ? files[0].id : null,
          invoice_number: invoice_number,
          date_of_invoice: date_of_invoice ? parseDateForBackend(date_of_invoice) : null,
          receipt_date: receipt_date ? parseDateForBackend(receipt_date) : null,
          sss_invoice_receipt_date: parseDateForBackend(data?.sss_invoice_receipt_date),
          bank_account: data?.bank_account?.id,
          date_of_payment: parseDateForBackend(data?.date_of_payment),
          description: data?.description,
          passed_to_accounting: data?.passed_to_accounting,
          passed_to_inventory: data?.passed_to_inventory,
          type: 'invoices',
          organization_unit_id: contextMain?.organization_unit?.id,
          pro_forma_invoice_number: data?.pro_forma_invoice_number,
          pro_forma_invoice_date: pro_forma_invoice_date ? parseDateForBackend(pro_forma_invoice_date) : null,
          articles: fields.map((_, index) => ({
            title: data.articles[index]?.title,
            net_price: data.articles[index]?.net_price,
            description: data.articles[index]?.description,
            account_id: data.articles[index]?.account?.id,
            vat_percentage: data.articles[index]?.vat_percentage?.id,
            amount: data.articles[index]?.amount,
          })),
        };
        insertInvoice(
          payload,
          () => {
            alert.success('Uspješno dodavanje računa.');
            navigate('/finance/liabilities-receivables/liabilities/invoices');
          },
          () => alert.error('Neuspješno dodavanje računa.'),
        );
      });

      return;
    } else if (isManual && !uploadedFile && !invoice?.file && !invoice?.pro_forma_invoice_file) {
      setShowFileUploadError(true);
    } else {
      const payload = {
        id: data?.id,
        is_invoice: data.is_invoice?.id,
        supplier_id: data?.supplier_id?.id,
        order_id: selectedOrderOption,
        file_id: invoice?.file?.id || null,
        pro_forma_invoice_file_id: invoice?.pro_forma_invoice_file?.id,
        invoice_number: invoice_number,
        date_of_invoice: date_of_invoice ? parseDateForBackend(date_of_invoice) : null,
        receipt_date: receipt_date ? parseDateForBackend(receipt_date) : null,
        sss_invoice_receipt_date: parseDateForBackend(data?.sss_invoice_receipt_date),
        bank_account: data?.bank_account?.id,
        date_of_payment: parseDateForBackend(data?.date_of_payment),
        organization_unit_id: contextMain?.organization_unit?.id,
        description: data?.description,
        type: 'invoices',
        pro_forma_invoice_number: data?.pro_forma_invoice_number,
        pro_forma_invoice_date: pro_forma_invoice_date ? parseDateForBackend(pro_forma_invoice_date) : null,
        passed_to_accounting: data?.passed_to_accounting,
        passed_to_inventory: data?.passed_to_inventory,
        articles: fields.map((_, index) => ({
          title: data.articles[index]?.title,
          net_price: data.articles[index]?.net_price,
          description: data.articles[index]?.description,
          account_id: data.articles[index]?.account?.id,
          vat_percentage: data.articles[index]?.vat_percentage?.id,
          amount: data.articles[index]?.amount,
        })),
      };
      insertInvoice(
        payload,
        () => {
          alert.success('Uspješno dodavanje računa.');
          navigate('/finance/liabilities-receivables/liabilities/invoices');
        },
        () => alert.error('Neuspješno dodavanje računa.'),
      );
    }

    return;
  };

  const removeRow = (idToRemove: number) => {
    const indexToRemove = fields.findIndex(field => field.id === idToRemove);
    if (indexToRemove !== -1) {
      remove(indexToRemove);
    }
  };

  useEffect(() => {
    // * When order is selected, invoice number, date of invoice, receipt date and articles are set from its values
    if (selectedOrderOption) {
      const selectedOrder = orders.find(order => order.id === selectedOrderOption)!;

      if (!selectedOrder) return;

      if (selectedOrder.receive_file) setAccountingInvoiceFile(selectedOrder.receive_file);
      if (selectedOrder.order_file) setAccountingProFormaInvoiceFile(selectedOrder.order_file);

      if (selectedOrder.invoice_number) setValue('invoice_number', selectedOrder.invoice_number);
      if (selectedOrder.invoice_date) setValue('date_of_invoice', new Date(selectedOrder.invoice_date));
      if (selectedOrder.pro_forma_invoice_date)
        setValue('pro_forma_invoice_date', new Date(selectedOrder.pro_forma_invoice_date));
      if (selectedOrder.pro_forma_invoice_number)
        setValue('pro_forma_invoice_number', selectedOrder.pro_forma_invoice_number);
      if (selectedOrder.date_system) setValue('receipt_date', new Date(selectedOrder.date_system));

      if (selectedOrder.articles && selectedOrder.articles.length) {
        for (const article of selectedOrder.articles) {
          append({
            id: article.id,
            title: article.title,
            net_price: article.net_price,
            vat_price: 0,
            description: article.description,
            account: null,
            vat_percentage: {id: Number(article.vat_percentage), title: article.vat_percentage},
            amount: article.amount,
          });
        }
      }
    }
  }, [selectedOrderOption]);

  const dropdownOrderOptions = useMemo(() => {
    return orders?.map(item => {
      return {
        id: item.id,
        title: item.invoice_number,
      };
    });
  }, [orders]);

  const resetFormValues = () => {
    setValue('order_id', null);
    setValue('invoice_number', '');
    setValue('articles', []);
    setValue('invoice_type', {id: '', title: ''});
    setValue('date_of_invoice', undefined);
    setValue('receipt_date', undefined);
  };

  useEffect(() => {
    !invoice && resetFormValues();
  }, [watch('is_invoice')]);

  const type = watch('is_invoice');

  const passedToInventory = watch('passed_to_inventory');
  const passedToAccounting = watch('passed_to_accounting');

  useEffect(() => {
    if (invoice) {
      reset({
        ...invoice,
        id: invoice.id,
        invoice_type:
          type?.id === false
            ? {id: 'manual', title: 'Ručni unos'}
            : invoice.order_id !== 0 && type?.id
            ? {id: 'accounting', title: 'Materijalno knjigovodstvo'}
            : {id: 'manual', title: 'Ručni unos'},
        supplier_id: {id: invoice.supplier.id, title: invoice.supplier.title},
        order_id: dropdownOrderOptions.find((ord: DropdownData<number>) => ord?.id === invoice.order_id),
        file_id: invoice.file.id,
        is_invoice: invoice.is_invoice === false ? {id: false, title: 'Predračun'} : {id: true, title: 'Račun'},
        invoice_number: invoice.invoice_number,
        date_of_invoice: invoice.date_of_invoice,
        receipt_date: invoice.receipt_date,
        date_of_payment: invoice.date_of_payment,
        bank_account: {id: invoice.bank_account, title: invoice.bank_account},
        description: invoice?.description,
        passed_to_inventory: invoice?.passed_to_inventory,
        passed_to_accounting: invoice?.passed_to_accounting,
        pro_forma_invoice_date: invoice?.pro_forma_invoice_date,
        pro_forma_invoice_number: invoice?.pro_forma_invoice_number,
        articles: invoice.articles.map((_, index) => ({
          title: invoice.articles[index]?.title,
          amount: invoice.articles[index]?.amount,
          net_price: invoice.articles[index]?.net_price,
          description: invoice.articles[index]?.description,
          account: {id: invoice.articles[index]?.account?.id, title: invoice.articles[index]?.account?.title},
          vat_percentage: {
            id: invoice.articles[index]?.vat_percentage,
            title: ` ${invoice.articles[index]?.vat_percentage}`,
          },
        })),
      });
    }
  }, [invoice]);

  return (
    <InvoiceEntryForm>
      <>
        <Row>
          <Controller
            name="is_invoice"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="TIP:"
                placeholder="Odaberite tip"
                options={TypeOptions}
                error={errors?.type_for_invoice?.message}
                isRequired
                isDisabled={invoice !== undefined}
              />
            )}
          />
          <Controller
            name="invoice_type"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="TIP RAČUNA:"
                placeholder="Odaberite tip računa"
                options={type?.id === false ? [invoiceTypeOptions[0]] : invoiceTypeOptions}
                error={errors?.invoice_type?.message}
                isRequired
                isDisabled={type === undefined || invoice !== undefined}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name="supplier_id"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="DOBAVLJAČ:"
                placeholder="Odaberite ime dobavljača"
                options={suppliers}
                isDisabled={type === undefined || invoice?.status === 'Na nalogu'}
                error={errors?.supplier_id?.message}
                isRequired
              />
            )}
          />
          <Controller
            name="order_id"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="NARUDŽBENICA:"
                placeholder="Odaberite narudžbenicu"
                options={dropdownOrderOptions}
                isDisabled={isManual || isManual === undefined || invoice?.status === 'Na nalogu'}
                error={errors?.order_id?.message}
              />
            )}
          />

          <Input
            {...register('pro_forma_invoice_number')}
            label="BROJ PREDRAČUNA:"
            placeholder="Unesite broj računa"
            error={errors?.invoice_number?.message}
            isRequired
            disabled={type?.id === true || Boolean(selectedOrderOption) || invoice?.status === 'Na nalogu'}
          />

          <Input
            {...register('invoice_number')}
            label="BROJ RAČUNA:"
            placeholder="Unesite broj računa"
            disabled={
              (!invoice && type?.id === false) ||
              (!invoice && type?.id === true && !isManual) ||
              (invoice && !invoice?.pro_forma_invoice_number) ||
              invoice?.status === 'Na nalogu'
            }
            error={errors?.invoice_number?.message}
            isRequired
          />
        </Row>
        {/* TODO: This date is being added by the accountant of SSS */}
        {/* Flex row shared flex component is being tested here */}
        <FlexRow gap="0.5rem" justify="between" style={{marginBottom: 25}} stretchChildren>
          <Controller
            name="pro_forma_invoice_date"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PREDRAČUNA:"
                onChange={onChange}
                disabled={
                  type?.id === true ||
                  (Boolean(selectedOrderOption) && pro_forma_invoice_date) ||
                  invoice?.status === 'Na nalogu'
                }
                error={errors?.date_of_invoice?.message}
                isRequired
              />
            )}
          />

          <Controller
            name="date_of_invoice"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM RAČUNA:"
                onChange={onChange}
                disabled={
                  (!invoice && type?.id === false) ||
                  (!invoice && type?.id === true && !isManual) ||
                  (invoice && !invoice?.pro_forma_invoice_date) ||
                  invoice?.status === 'Na nalogu'
                }
                error={errors?.date_of_invoice?.message}
                isRequired
              />
            )}
          />
          <Controller
            name="receipt_date"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM PRIJEMA ROBE:"
                onChange={onChange}
                disabled={(Boolean(selectedOrderOption) && receipt_date) || invoice?.status === 'Na nalogu'}
              />
            )}
          />
          <Controller
            name="sss_invoice_receipt_date"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label={type?.id === false ? 'DATUM PRIJEMA PREDRAČUNA SSS' : 'DATUM PRIJEMA RAČUNA SSS:'}
                onChange={onChange}
                error={errors?.sss_invoice_receipt_date?.message}
                isRequired
                disabled={invoice?.status === 'Na nalogu'}
              />
            )}
          />
        </FlexRow>
        {isManual && (
          <FileUploadWrapper>
            <FileUpload
              icon={null}
              files={uploadedFile}
              disabled={invoice?.status === 'Na nalogu'}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content={type.id === false ? 'Predračun' : 'Račun'} />}
              hint={
                type.id === false
                  ? 'Fajlovi neće biti učitani dok ne sačuvate predračun.'
                  : 'Fajlovi neće biti učitani dok ne sačuvate račun.'
              }
              buttonText="Učitaj"
              error={showFileUploadError ? 'Morate učitati fajl' : undefined}
            />
          </FileUploadWrapper>
        )}
        {!!invoice?.file.id && (
          <FileListWrapper>
            <Typography variant="bodySmall" style={{fontWeight: 600}} content={'RAČUN:'} />
            <FileListComponent files={(invoice?.file && [invoice.file]) ?? []} />
          </FileListWrapper>
        )}

        {!!invoice?.pro_forma_invoice_file.id && (
          <FileListWrapper>
            <Typography variant="bodySmall" style={{fontWeight: 600}} content={'PREDRAČUN:'} />
            <FileListComponent files={invoice?.pro_forma_invoice_file ? [invoice?.pro_forma_invoice_file] : []} />
          </FileListWrapper>
        )}

        {!!accountingInvoiceFile?.id && !isManual && !invoice?.file && (
          <FileListWrapper>
            <Typography variant="bodySmall" style={{fontWeight: 600}} content={'RAČUN:'} />
            <FileListComponent files={(accountingInvoiceFile && [accountingInvoiceFile]) ?? []} />
          </FileListWrapper>
        )}

        {!!accountingProFormaInvoiceFile?.id && !isManual && !invoice?.pro_forma_invoice_file && (
          <FileListWrapper>
            <Typography variant="bodySmall" style={{fontWeight: 600}} content={'PREDRAČUN:'} />
            <FileListComponent files={(accountingProFormaInvoiceFile && [accountingProFormaInvoiceFile]) ?? []} />
          </FileListWrapper>
        )}

        <Row>
          <Controller
            name="bank_account"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="ŽIRO RAČUN:"
                placeholder="Odaberite broj računa"
                options={
                  supplierBankAccounts
                    ? supplierBankAccounts.map((account: string) => ({id: account, title: account}))
                    : []
                }
                error={errors?.bank_account?.message}
                isRequired
                isDisabled={invoice?.status === 'Na nalogu'}
              />
            )}
          />
          <Controller
            name="date_of_payment"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM VALUTE:"
                onChange={onChange}
                error={errors?.date_of_payment?.message}
                isRequired
                disabled={invoice?.status === 'Na nalogu'}
              />
            )}
          />
        </Row>
        <Row>
          <Input
            {...register('description')}
            label="OPIS:"
            textarea
            placeholder="Unesite opis"
            disabled={invoice?.status === 'Na nalogu'}
          />
        </Row>

        {isManual && (
          <div style={{width: 350, marginTop: 20}}>
            <Controller
              name="passed_to_accounting"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <StyledSwitch
                  name={name}
                  checked={value as any}
                  onChange={onChange}
                  content={
                    <Typography
                      variant="bodyMedium"
                      content="PROSLIJEDITE U MATERIJALNO KNJIGOVODSTVO:"
                      style={{marginLeft: 10}}
                    />
                  }
                  disabled={passedToInventory === true || invoice?.status === 'Na nalogu'}
                  theme={Theme}
                />
              )}
            />
          </div>
        )}
        {type?.id === true && isManual && (
          <div style={{width: 350, marginBlock: 20}}>
            <Controller
              name="passed_to_inventory"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <StyledSwitch
                    name={name}
                    checked={value as any}
                    onChange={onChange}
                    content={
                      <Typography
                        variant="bodyMedium"
                        content="PROSLIJEDITE U OSNOVNA SREDSTVA:"
                        style={{marginLeft: 10}}
                      />
                    }
                    disabled={passedToAccounting === true || invoice?.status === 'Na nalogu'}
                    theme={Theme}
                  />
                );
              }}
            />
          </div>
        )}
        {isManual && (
          <PlusButtonWrapper>
            <PlusButton onClick={handleSubmit(handleAddRow)} />
          </PlusButtonWrapper>
        )}

        <Table
          tableHeads={invoiceTableHeads}
          data={fields}
          tableActions={[
            {
              name: 'Ukloni',
              icon: <XIcon stroke={Theme?.palette?.gray800} width="10px" />,
              onClick: row => {
                removeRow(row?.id);
              },
              tooltip: () => 'Uklonite artikal',
              shouldRender: () => isManual,
            },
          ]}
        />
        {/* For now we do not need this */}
        {/* {fields.length > 0 && (
          <>
            <FlexColumn style={{marginTop: '1rem'}}>
              <Amount>
                <Typography style={{fontWeight: 600}} variant="bodySmall" content="NETO IZNOS:" />
                <Typography variant="bodySmall" content={`${totalNet?.toFixed(2)}Є`} />
              </Amount>
              <Amount>
                <Typography style={{fontWeight: 600}} variant="bodySmall" content="PDV:" />
                <Typography variant="bodySmall" content={`${totalVat?.toFixed(2)}Є`} />
              </Amount>
              <Amount>
                <Typography style={{fontWeight: 600}} variant="bodySmall" content="UKUPAN IZNOS:" />
                <Typography variant="bodySmall" content={`${(totalNet + totalVat)?.toFixed(2)}Є`} />
              </Amount>
              <InvoiceAmount>
                <Typography variant="bodySmall" content="IZNOS FAKTURA PO RAČUNU" />
              </InvoiceAmount>
            </FlexColumn>
            <Table tableHeads={invoiceAmountTableHeads} data={fields} />
          </>
        )} */}
      </>
      <Footer>
        <Button
          content="Odustani"
          variant="secondary"
          style={{width: 130}}
          onClick={() => navigate('/finance/liabilities-receivables/liabilities/invoices')}
        />
        <Button
          content="Sačuvaj"
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={invoice?.status === 'Na nalogu'}
        />
      </Footer>
    </InvoiceEntryForm>
  );
};

export default InvoiceEntry;
