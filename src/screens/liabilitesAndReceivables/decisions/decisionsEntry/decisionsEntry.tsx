import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, Input, Table, TableHead, Typography} from 'client-library';
import {useEffect, useMemo} from 'react';
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
import {DecisionItem} from '../../../../types/graphQL/invoice.ts';
import {createDropdownOptions} from '../../../../utils/createOptions.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {SourceOfFunding} from '../constants.tsx';
import {decisionsSchema} from './constants.tsx';
import {DecisionsFormContainer, HalfWidthContainer, Row} from './styles.ts';

type DecisionEntryForm = yup.InferType<typeof decisionsSchema>;
interface DecisionFormProps {
  decision?: DecisionItem;
}

const DecisionsEntry = ({decision}: DecisionFormProps) => {
  const {
    alert,
    navigation: {navigate},
  } = useAppContext();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: {errors},
    setValue,
  } = useForm<DecisionEntryForm>({
    resolver: yupResolver(decisionsSchema),
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

  const {suppliers} = useGetSuppliers({});
  const {suppliers: municipalities} = useGetSuppliers({entity: 'municipalities'});
  const {data: taxAuthorityCodebook} = useGetTaxAuthorityCodebook();
  const {counts} = useGetCountOverview({level: 3});
  const {insertInvoice, loading} = useInsertInvoice();

  const optionsForTaxAuthorityCodebook = createDropdownOptions(taxAuthorityCodebook || []);

  const {data: additionalExpenses, calculateAdditionalExpenses} = useCalculateAdditionalExpenses({
    tax_authority_codebook_id: tax_authority_codebook_id?.id ? tax_authority_codebook_id?.id : null,
    municipality_id: municipality_id?.id ? municipality_id?.id : null,
    net_price: net_price ? Number(net_price) : null,
    gross_price: gross_price ? Number(gross_price) : null,
    previous_income_net: previous_income_net ? Number(previous_income_net) : null,
    previous_income_gross: previous_income_gross ? Number(previous_income_gross) : null,
  });

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
      title: 'Iznos',
      accessor: 'price',
      type: 'custom',
      renderContents: price => <Typography content={price || ''} />,
    },
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
              />
            </div>
          )}
        />
      ),
    },
    {title: 'Opis', accessor: 'title'},
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

  const onSubmit = async (data: any) => {
    if (loading) return;

    const payload = {
      id: data?.id,
      invoice_number: data.invoice_number,
      tax_authority_codebook_id: data?.tax_authority_codebook_id?.id,
      municipality_id: data?.municipality_id?.id,
      supplier_id: data?.supplier_id?.id,
      date_of_invoice: parseDateForBackend(data?.date_of_invoice),
      receipt_date: parseDateForBackend(data?.receipt_date),
      sss_invoice_receipt_date: parseDateForBackend(data?.sss_invoice_receipt_date),
      type: 'decisions',
      type_of_decision: data?.type_of_decision?.id,
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
        bank_account: data.additionalExpenses[index]?.bank_account?.id,
        subject_id: index === fields.length - 1 ? data?.supplier_id?.id : data.additionalExpenses[index]?.subject.id,
      })),
    };

    insertInvoice(
      payload as any,
      () => {
        alert.success('Uspješno dodavanje rješenja.');
        navigate('/finance/liabilities-receivables/liabilities/decisions');
      },
      () => alert.error('Neuspješno dodavanje rješenja.'),
    );

    return;
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
    if (decision) {
      reset({
        ...decision,
        id: decision.id,
        supplier_id: {id: decision.supplier.id, title: decision.supplier.title},
        supplier_title: decision.supplier_title,
        invoice_number: decision.invoice_number,
        date_of_invoice: decision.date_of_invoice !== null ? new Date(decision.date_of_invoice) : undefined,
        receipt_date: decision.receipt_date !== null ? new Date(decision.receipt_date) : undefined,
        date_of_payment: decision.date_of_payment !== null ? new Date(decision.date_of_payment) : undefined,
        description: decision?.description,
        issuer: decision?.issuer,
        source_of_funding: {id: decision.source_of_funding, title: decision.source_of_funding},
        municipality_id: {id: decision.municipality.id, title: decision.municipality.title},
        tax_authority_codebook_id: {
          id: decision.tax_authority_codebook.id,
          title: decision.tax_authority_codebook.title,
        },
        additionalExpenses: decision.additional_expenses.map((_, index) => ({
          id: decision.additional_expenses[index]?.id,
          title: decision.additional_expenses[index]?.title,
          price: decision.additional_expenses[index]?.price,
          bank_account: {
            id: decision.additional_expenses[index]?.bank_account,
            title: decision.additional_expenses[index]?.bank_account,
          },
          account: {
            id: decision.additional_expenses[index]?.account?.id,
            title: decision.additional_expenses[index]?.account?.title,
          },
          subject: {
            id: decision.additional_expenses[index]?.subject?.id,
            title: decision.additional_expenses[index]?.subject?.title,
          },
        })),
      });
    }
  }, [decision]);

  return (
    <DecisionsFormContainer>
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
                error={errors?.supplier_id?.message}
              />
            )}
          />
          <Input
            {...register('invoice_number')}
            label="BROJ PREDMETA:"
            placeholder="Unesite broj predmeta"
            error={errors.invoice_number?.message}
          />
          <Input
            {...register('issuer')}
            label="SUBJEKT KOJI JE IZDAO RJEŠENJE:"
            placeholder="Odaberite subjekt"
            error={errors.issuer?.message}
          />
        </Row>
        <Row>
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
              />
            )}
          />
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
                label="DATUM RJEŠENJA:"
                onChange={onChange}
                error={errors.date_of_invoice?.message}
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
                label="DATUM PRIJEMA RJEŠENJA:"
                onChange={onChange}
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
                label="DATUM PRIJEMA RJEŠENJA SSS:"
                onChange={onChange}
              />
            )}
          />
        </Row>
        <Row>
          <Input {...register('description')} label="OPIS:" textarea placeholder="Unesite opis" />
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
                      placeholder="Odaberite opštinu"
                      options={municipalities}
                      isSearchable
                      error={errors.municipality_id?.message}
                    />
                  )}
                />
                <Controller
                  name="tax_authority_codebook_id"
                  control={control}
                  render={({field: {name, value, onChange}}) => (
                    <Dropdown
                      name={name}
                      value={value}
                      onChange={onChange}
                      label="ŠIFARNIK PORESKE UPRAVE:"
                      placeholder="Odaberite šifarnik"
                      options={optionsForTaxAuthorityCodebook}
                      error={errors.tax_authority_codebook_id?.message}
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
                  type="number"
                  inputMode="decimal"
                  leftContent={<div>€</div>}
                  disabled={net_price as any}
                  error={errors.gross_price?.message}
                />
                <Input
                  {...register('previous_income_gross')}
                  label="PRETHODNA PRIMANJA U MJESECU BRUTO:"
                  placeholder="Unesite prethodna primanja"
                  type={'number'}
                  inputMode={'decimal'}
                  leftContent={<div>€</div>}
                  disabled={previous_income_net as any}
                  error={errors.previous_income_gross?.message}
                />
              </Row>
              <Row>
                <Input
                  {...register('net_price')}
                  label={'NETO IZNOS:'}
                  placeholder={'Unesite neto iznos'}
                  type={'number'}
                  inputMode={'decimal'}
                  leftContent={<div>€</div>}
                  disabled={gross_price as any}
                  error={errors.net_price?.message}
                />
                <Input
                  {...register('previous_income_net')}
                  label="PRETHODNA PRIMANJA U MJESECU NETO:"
                  placeholder="Unesite prethodna primanja"
                  type={'number'}
                  inputMode={'decimal'}
                  leftContent={<div>€</div>}
                  disabled={previous_income_gross as any}
                  error={errors.previous_income_net?.message}
                />
              </Row>
              <Button content="Obračunaj" variant={'primary'} onClick={() => onCount()} />
            </HalfWidthContainer>
          </>
        )}

        {!!fields.length && <Table tableHeads={additionalExpensesTableHeads} data={fields} />}

        <Footer>
          <Button
            content="Odustani"
            variant="secondary"
            style={{width: 130}}
            onClick={() => navigate('/finance/liabilities-receivables/liabilities/decisions')}
          />
          <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} disabled={!fields.length} />
        </Footer>
      </>
    </DecisionsFormContainer>
  );
};

export default DecisionsEntry;
