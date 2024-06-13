import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, Input, Table, TableHead, Typography, FileUpload} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {generateDropdownOptions} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useCalculateAdditionalExpenses from '../../../../services/graphQL/calculateAdditionalExpenses/useCalculateAdditionalExpenses.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import useInsertInvoice from '../../../../services/graphQL/invoice/useInsertInvoice.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import useGetTaxAuthorityCodebook from '../../../../services/graphQL/taxAuthorityCodebook/useGetTaxAuthorityCodebookOverview.tsx';
import Footer from '../../../../shared/footer.ts';
import {ContractItem} from '../../../../types/graphQL/invoice.ts';
import {createDropdownOptions} from '../../../../utils/createOptions.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {contractsSchema} from './constants.tsx';
import {ContractsFormContainer, HalfWidthContainer, Row} from './styles.ts';
import {getSuppliersDropdown} from '../../salaries/salaryUtils.ts';
import {roundCurrency} from '../../../../utils/roundCurrency.ts';
import {FileResponseItem} from '../../../../types/fileUploadType.ts';
import {FileUploadWrapper} from '../../../../shared/FileUploadWrapper.ts';
import {FileListWrapper} from '../../invoices/invoicesOverview/styles.ts';
import FileListComponent from '../../../../components/fileList/fileList.tsx';
import {MainTitle} from '../../../../shared/pageElements.ts';
import {SourceOfFunding} from '../../decisions/constants.tsx';

type ContractEntryForm = yup.InferType<typeof contractsSchema>;
interface ContractFormProps {
  contract?: ContractItem;
}

const ContractsEntry = ({contract}: ContractFormProps) => {
  const {
    alert,
    navigation: {navigate},
    contextMain,
    fileService: {uploadFile},
  } = useAppContext();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {errors},
  } = useForm<ContractEntryForm>({
    defaultValues: {
      issuer: contextMain?.organization_unit?.title,
    },
    resolver: yupResolver(contractsSchema),
  });
  const {
    net_price,
    gross_price,
    previous_income_net,
    previous_income_gross,
    tax_authority_codebook_id,
    municipality_id,
    supplier_id,
  } = watch();

  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);

  const {suppliers} = useGetSuppliers({});

  const {data: taxAuthorityCodebook} = useGetTaxAuthorityCodebook();
  const {suppliers: municipalities} = useGetSuppliers({entity: 'municipalities'});
  const {counts} = useGetCountOverview({level: 3});
  const {insertInvoice, loading} = useInsertInvoice();

  const {data: additionalExpenses, calculateAdditionalExpenses} = useCalculateAdditionalExpenses({
    tax_authority_codebook_id: tax_authority_codebook_id?.id ? tax_authority_codebook_id?.id : null,
    municipality_id: municipality_id?.id ? municipality_id?.id : null,
    net_price: net_price ? net_price.toString().replace(',', '.') : null,
    gross_price: gross_price ? gross_price.toString().replace(',', '.') : null,
    previous_income_net: previous_income_net ? previous_income_net.toString().replace(',', '.') : null,
    previous_income_gross: previous_income_gross ? previous_income_gross.toString().replace(',', '.') : null,
  });

  const optionsForTaxAuthorityCodebook = createDropdownOptions(taxAuthorityCodebook || []);

  const {fields, remove, insert} = useFieldArray({
    control,
    name: 'additionalExpenses',
    keyName: 'key',
  });

  const dropdowncountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const onCount = () => {
    calculateAdditionalExpenses();
  };

  const additionalExpensesTableHeads: TableHead[] = [
    {
      title: 'Konto',
      accessor: 'account',
      type: 'custom',
      renderContents: (_item, _row, index) => (
        <Controller
          name={`additionalExpenses.${index}.account`}
          control={control}
          render={({field: {onChange, name, value}}) => (
            <div style={{minWidth: '200px'}}>
              <Dropdown
                options={dropdowncountsOptions}
                name={name}
                value={value}
                onChange={onChange}
                error={errors?.additionalExpenses?.[index]?.account?.message}
                isDisabled={contract?.status === 'Na nalogu'}
              />
            </div>
          )}
        />
      ),
    },
    {title: 'Opis', accessor: 'title'},
    {
      title: 'Iznos',
      accessor: 'price',
      type: 'custom',
      renderContents: price => <Typography content={roundCurrency(price)} />,
    },
    {
      title: 'Subjekat',
      accessor: 'subject',
      type: 'custom',
      renderContents: subject => <Typography content={subject?.title} />,
    },
    {
      title: 'Račun banke',
      accessor: 'bank_account',
      type: 'custom',
      renderContents: (_item, row, index) => {
        const supplierOptions = suppliers?.find(supplier => supplier.id === row.subject.id);
        const bankAccounts = supplierOptions?.bank_accounts.map(account => ({id: account, title: account})) ?? [];

        useEffect(() => {
          if (!bankAccounts.length) return;
          // automatically select first bank account for the subject
          setValue(`additionalExpenses.${index}.bank_account`, bankAccounts[0]);
        }, []);
        return (
          <>
            <Controller
              name={`additionalExpenses.${index}.bank_account`}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <div style={{minWidth: '200px'}}>
                  <Dropdown
                    options={bankAccounts}
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={errors?.additionalExpenses?.[index]?.bank_account?.message}
                    isDisabled={contract?.status === 'Na nalogu'}
                  />
                </div>
              )}
            />
          </>
        );
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const suppliersDropdownOptions = useMemo(() => {
    return getSuppliersDropdown(suppliers);
  }, [suppliers]);

  const selectedSupplier = suppliersDropdownOptions.find(s => s.id === supplier_id?.id);
  const selectedSupplierEntity = selectedSupplier?.entity;

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };

  const onSubmit = async (data: any) => {
    if (loading) return;
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(formData, (files: FileResponseItem[]) => {
        setUploadedFile(null);
        const payload = {
          id: data?.id,
          invoice_number: data.invoice_number,
          tax_authority_codebook_id: data?.tax_authority_codebook_id?.id,
          municipality_id: data?.municipality_id?.id,
          supplier_id: data?.supplier_id?.id,
          date_of_invoice: parseDateForBackend(data?.date_of_invoice),
          date_of_start: parseDateForBackend(data?.date_of_start),
          receipt_date: parseDateForBackend(data?.receipt_date),
          sss_invoice_receipt_date: parseDateForBackend(data?.sss_invoice_receipt_date),
          type: 'contracts',
          supplier_title: data.supplier_title,
          issuer: data?.issuer,
          activity_id: data?.activity_id?.id,
          source_of_funding: data?.source_of_funding?.id,
          date_of_payment: parseDateForBackend(data?.date_of_payment),
          description: data?.description,
          file_id: files[0]?.id,
          additional_expenses: fields.map((_, index) => ({
            title: data.additionalExpenses[index]?.title,
            price: data.additionalExpenses[index]?.price,
            account_id: data.additionalExpenses[index]?.account?.id,
            bank_account: data.additionalExpenses[index]?.bank_account.id,
            subject_id:
              index === fields.length - 1 ? data?.supplier_id?.id : data.additionalExpenses[index]?.subject.id,
          })),
        };

        insertInvoice(
          payload as any,
          () => {
            alert.success('Uspješno dodavanje ugovora.');
            navigate('/finance/liabilities-receivables/liabilities/contracts');
          },
          () => alert.error('Neuspješno dodavanje ugovora.'),
        );
      });

      return;
    } else {
      const payload = {
        id: data?.id,
        invoice_number: data.invoice_number,
        tax_authority_codebook_id: data?.tax_authority_codebook_id?.id,
        municipality_id: data?.municipality_id?.id,
        supplier_id: data?.supplier_id?.id,
        date_of_invoice: parseDateForBackend(data?.date_of_invoice),
        date_of_start: parseDateForBackend(data?.date_of_start),
        receipt_date: parseDateForBackend(data?.receipt_date),
        sss_invoice_receipt_date: parseDateForBackend(data?.sss_invoice_receipt_date),
        type: 'contracts',
        supplier_title: data.supplier_title,
        issuer: data?.issuer,
        activity_id: data?.activity_id?.id,
        source_of_funding: data?.source_of_funding?.id,
        date_of_payment: parseDateForBackend(data?.date_of_payment),
        description: data?.description,
        additional_expenses: fields.map((_, index) => ({
          title: data.additionalExpenses[index]?.title,
          price: data.additionalExpenses[index]?.price,
          account_id: data.additionalExpenses[index]?.account?.id,
          bank_account: data.additionalExpenses[index]?.bank_account.id,
          subject_id: index === fields.length - 1 ? data?.supplier_id?.id : data.additionalExpenses[index]?.subject.id,
        })),
      };

      insertInvoice(
        payload as any,
        () => {
          alert.success('Uspješno dodavanje ugovora.');
          navigate('/finance/liabilities-receivables/liabilities/contracts');
        },
        () => alert.error('Neuspješno dodavanje ugovora.'),
      );

      return;
    }
  };

  useEffect(() => {
    if (additionalExpenses) {
      if (additionalExpenses && additionalExpenses.length) {
        for (let i = fields.length - 1; i >= 0; i--) {
          remove(i);
        }

        additionalExpenses.forEach((article, index) => {
          insert(index, {
            id: Math.random(),
            title: article.title,
            price: article.price,
            account: {id: 0, title: ''},
            subject:
              article.subject.title !== ''
                ? {id: article.subject.id, title: article.subject.title}
                : {id: supplier_id?.id, title: supplier_id?.title},
            bank_account: {id: '', title: ''},
            organization_unit_id: article.organization_unit,
          });
        });
      }
    }
  }, [additionalExpenses]);

  useEffect(() => {
    if (contract) {
      reset({
        id: contract.id,
        supplier_id: {id: contract.supplier.id, title: contract.supplier.title},
        supplier_title: contract.supplier_title,
        invoice_number: contract.invoice_number,
        sss_invoice_receipt_date:
          contract.sss_invoice_receipt_date !== null ? new Date(contract.sss_invoice_receipt_date) : undefined,
        date_of_invoice: contract.date_of_invoice !== null ? new Date(contract.date_of_invoice) : undefined,
        date_of_start: contract.date_of_start !== null ? new Date(contract.date_of_start) : undefined,
        receipt_date: contract.receipt_date !== null ? new Date(contract.receipt_date) : undefined,
        date_of_payment: contract.date_of_payment !== null ? new Date(contract.date_of_payment) : undefined,
        description: contract?.description,
        source_of_funding: {id: contract.source_of_funding, title: contract.source_of_funding},
        issuer: contract?.issuer,
        municipality_id: {id: contract.municipality.id, title: contract.municipality.title},
        tax_authority_codebook_id: {
          id: contract.tax_authority_codebook.id,
          title: contract.tax_authority_codebook.title,
        },
        additionalExpenses: contract.additional_expenses.map((_, index) => ({
          id: contract.additional_expenses[index]?.id,
          title: contract.additional_expenses[index]?.title,
          price: contract.additional_expenses[index]?.price,
          bank_account: {
            id: contract.additional_expenses[index]?.bank_account,
            title: contract.additional_expenses[index]?.bank_account,
          },
          account: {
            id: contract.additional_expenses[index]?.account?.id,
            title: contract.additional_expenses[index]?.account?.title,
          },
          subject: {
            id: contract.additional_expenses[index]?.subject?.id,
            title: contract.additional_expenses[index]?.subject?.title,
          },
        })),
      });
    }
  }, [contract]);

  return (
    <ContractsFormContainer>
      <>
        <Row>
          <Controller
            name="supplier_id"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="SUBJEKT:"
                placeholder="Odaberite ime subjekta"
                options={suppliers}
                error={errors.supplier_id?.message}
                isDisabled={contract?.status === 'Na nalogu'}
              />
            )}
          />
          <Input
            {...register('invoice_number')}
            label="DJELOVODNI BROJ:"
            placeholder={'Unesite djelovodni broj'}
            disabled={contract?.status === 'Na nalogu'}
            error={errors.invoice_number?.message}
          />

          <Input
            {...register('issuer')}
            label="ORGANIZACIONA JEDINICA:"
            placeholder="Odaberite subjekt"
            error={errors.issuer?.message}
            disabled={contract?.status === 'Na nalogu'}
          />
          {/*Treba da se prikazu opcije iz sifarnika kad se zavrsi budzet*/}
          <Controller
            name={'activity_id'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="AKTIVNOST:"
                placeholder={'Odaberite aktivnost'}
                options={[]}
                isDisabled={contract?.status === 'Na nalogu'}
              />
            )}
          />
        </Row>

        <Row>
          <Controller
            name="source_of_funding"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="IZVOR FINANSIRANJA:"
                placeholder="Odaberite izvor finansiranja"
                options={SourceOfFunding}
                error={errors.source_of_funding?.message}
                isDisabled={contract?.status === 'Na nalogu'}
              />
            )}
          />
          <Controller
            name={'date_of_start'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="TRAJANJE UGOVORA:"
                placeholder={'Odaberite trajanje ugovora'}
                onChange={onChange}
                error={errors.date_of_start?.message}
                disabled={contract?.status === 'Na nalogu'}
              />
            )}
          />
          <Controller
            name={'date_of_invoice'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM UGOVORA:"
                onChange={onChange}
                error={errors.date_of_invoice?.message}
                disabled={contract?.status === 'Na nalogu'}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name="date_of_payment"
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="DATUM VALUTE:"
                onChange={onChange}
                error={errors.date_of_payment?.message}
                disabled={contract?.status === 'Na nalogu'}
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
                label="DATUM PRIJEMA U RAČUNOVODSTVO:"
                onChange={onChange}
                disabled={contract?.status === 'Na nalogu'}
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
                label="DATUM PRIJEMA UGOVORA SSS:"
                onChange={onChange}
                disabled={contract?.status === 'Na nalogu'}
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
            disabled={contract?.status === 'Na nalogu'}
          />
        </Row>
        <Row>
          <FileUploadWrapper>
            <FileUpload
              icon={null}
              files={uploadedFile}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Ugovor" />}
              hint={'Fajlovi neće biti učitani dok ne sačuvate ugovor.'}
              buttonText="Učitaj"
              disabled={contract?.status === 'Na nalogu'}
            />
          </FileUploadWrapper>
        </Row>
        <Row>
          {!!contract?.file.id && (
            <FileListWrapper>
              <Typography variant="bodySmall" style={{fontWeight: 600}} content={'UGOVOR:'} />
              <FileListComponent files={(contract?.file && [contract.file]) ?? []} />
            </FileListWrapper>
          )}
        </Row>
        {!!supplier_id && (
          <>
            <HalfWidthContainer>
              <Row>
                <Controller
                  name="municipality_id"
                  control={control}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      label="OPŠTINA:"
                      placeholder={'Odaberite opštinu'}
                      options={municipalities}
                      isSearchable
                      error={errors.municipality_id?.message}
                      isDisabled={contract?.status === 'Na nalogu'}
                    />
                  )}
                />

                <Controller
                  name={'tax_authority_codebook_id'}
                  control={control}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      label="ŠIFARNIK PORESKE UPRAVE:"
                      placeholder={'Odaberite šifarnik'}
                      options={optionsForTaxAuthorityCodebook}
                      error={errors.tax_authority_codebook_id?.message}
                      isDisabled={contract?.status === 'Na nalogu'}
                    />
                  )}
                />
              </Row>
            </HalfWidthContainer>
            <HalfWidthContainer>
              <Row>
                <Input
                  {...register('gross_price')}
                  label="IZNOS ZA UPLATU BRUTO:"
                  placeholder="Unesite iznos"
                  leftContent={<div>€</div>}
                  disabled={!!net_price || contract?.status === 'Na nalogu'}
                  error={errors.gross_price?.message}
                />
                <Input
                  {...register('previous_income_gross')}
                  label="PRETHODNA PRIMANJA U MJESECU BRUTO:"
                  placeholder="Unesite prethodna primanja"
                  leftContent={<div>€</div>}
                  disabled={
                    !!net_price ||
                    !!previous_income_net ||
                    selectedSupplierEntity !== 'employee' ||
                    contract?.status === 'Na nalogu'
                  }
                  error={errors.previous_income_gross?.message}
                />
              </Row>
              <Row>
                <Input
                  {...register('net_price')}
                  label={'NETO IZNOS:'}
                  placeholder={'Unesite neto iznos'}
                  leftContent={<div>€</div>}
                  disabled={!!gross_price || contract?.status === 'Na nalogu'}
                  error={errors.net_price?.message}
                />
                <Input
                  {...register('previous_income_net')}
                  label="PRETHODNA PRIMANJA U MJESECU NETO:"
                  placeholder="Unesite prethodna primanja"
                  leftContent={<div>€</div>}
                  disabled={
                    !!gross_price ||
                    !!previous_income_gross ||
                    selectedSupplierEntity !== 'employee' ||
                    contract?.status === 'Na nalogu'
                  }
                  error={errors.previous_income_net?.message}
                />
              </Row>
              <Button
                content="Obračunaj"
                variant={'primary'}
                onClick={() => onCount()}
                disabled={contract?.status === 'Na nalogu'}
              />
            </HalfWidthContainer>
          </>
        )}

        {!!fields.length && (
          <>
            {' '}
            <Table tableHeads={additionalExpensesTableHeads} data={fields} />
            {!!contract && contract?.net_price && contract?.vat_price && (
              <Row>
                <MainTitle
                  content={`Ukupno: ${roundCurrency(contract?.net_price + contract?.vat_price)}`}
                  style={{marginTop: 20, marginLeft: 10}}
                />
              </Row>
            )}{' '}
          </>
        )}
        <Footer>
          <Button
            content="Odustani"
            variant="secondary"
            style={{width: 130}}
            onClick={() => navigate('/finance/liabilities-receivables/liabilities/contracts')}
          />
          <Button
            content="Sačuvaj"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={!fields.length || contract?.status === 'Na nalogu'}
          />
        </Footer>
      </>
    </ContractsFormContainer>
  );
};

export default ContractsEntry;
