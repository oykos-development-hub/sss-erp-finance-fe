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
import {ContractItem} from '../../../../types/graphQL/invoice.ts';
import {createDropdownOptions} from '../../../../utils/createOptions.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {contractsSchema} from './constants.tsx';
import {ContractsFormContainer, HalfWidthContainer, Row} from './styles.ts';

type ContractEntryForm = yup.InferType<typeof contractsSchema>;
interface ContractFormProps {
  contract?: ContractItem;
}

const ContractsEntry = ({contract}: ContractFormProps) => {
  const {
    alert,
    navigation: {navigate},
  } = useAppContext();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: {errors},
  } = useForm<ContractEntryForm>({
    resolver: yupResolver(contractsSchema),
  });
  const {
    net_price,
    gross_price,
    previous_income_net,
    previous_income_gross,
    tax_authority_codebook_id,
    municipality_id,
    type_of_contract,
  } = watch();

  const {suppliers: subjectTypes} = useGetSuppliers({entity: 'subjects', parent_id: null});

  const {suppliers: subjects} = useGetSuppliers({
    entity: 'subjects',
    parent_id: type_of_contract ? type_of_contract.id : null,
  });
  const {data: taxAuthorityCodebook} = useGetTaxAuthorityCodebook();
  const {suppliers: municipalities} = useGetSuppliers({entity: 'municipalities'});
  const {counts} = useGetCountOverview({level: 3});
  const {insertInvoice, loading} = useInsertInvoice();

  const {data: additionalExpenses, calculateAdditionalExpenses} = useCalculateAdditionalExpenses({
    tax_authority_codebook_id: tax_authority_codebook_id?.id ? tax_authority_codebook_id?.id : null,
    municipality_id: municipality_id?.id ? municipality_id?.id : null,
    net_price: net_price ? Number(net_price) : null,
    gross_price: gross_price ? Number(gross_price) : null,
    previous_income_net: previous_income_net ? Number(previous_income_net) : null,
    previous_income_gross: previous_income_gross ? Number(previous_income_gross) : null,
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
      renderContents: (_item, _row, index) => {
        return (
          <Input
            {...register(`additionalExpenses.${index}.bank_account`)}
            style={{minWidth: '200px'}}
            error={errors?.additionalExpenses?.[index]?.bank_account?.message}
          />
        );
      },
    },

    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const {supplier_id} = watch();

  const onSubmit = async (data: any) => {
    if (loading) return;

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
      type_of_contract: data?.type_of_contract?.id,
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
        bank_account: data.additionalExpenses[index]?.bank_account,
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
            bank_account: '',
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
        date_of_invoice: contract.date_of_invoice !== null ? new Date(contract.date_of_invoice) : undefined,
        date_of_start: contract.date_of_start !== null ? new Date(contract.date_of_start) : undefined,
        receipt_date: contract.receipt_date !== null ? new Date(contract.receipt_date) : undefined,
        date_of_payment: contract.date_of_payment !== null ? new Date(contract.date_of_payment) : undefined,
        description: contract?.description,
        issuer: contract?.issuer,
        type_of_contract: {id: contract.type_of_contract.id, title: contract.type_of_contract.title},
        municipality_id: {id: contract.municipality.id, title: contract.municipality.title},
        tax_authority_codebook_id: {
          id: contract.tax_authority_codebook.id,
          title: contract.tax_authority_codebook.title,
        },
        additionalExpenses: contract.additional_expenses.map((_, index) => ({
          id: contract.additional_expenses[index]?.id,
          title: contract.additional_expenses[index]?.title,
          price: contract.additional_expenses[index]?.price,
          bank_account: contract.additional_expenses[index]?.bank_account,
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
            name={'type_of_contract'}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Dropdown
                name={name}
                value={value}
                onChange={onChange}
                label="VRSTA UGOVORA:"
                placeholder="Odaberite vrstu ugovora"
                options={subjectTypes}
                error={errors.type_of_contract?.message}
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
                label="SUBJEKT:"
                placeholder={'Odaberite ime subjekta'}
                options={subjects}
                isDisabled={!type_of_contract}
                error={errors.supplier_id?.message}
              />
            )}
          />
        </Row>
        <Row>
          <Input
            {...register('invoice_number')}
            label="DJELOVODNI BROJ:"
            placeholder={'Unesite djelovodni broj'}
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
              />
            )}
          />
        </Row>
        <Row>
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
                error={errors.date_of_payment?.message}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name={'receipt_date'}
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
            name={'sss_invoice_receipt_date'}
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
                />
              )}
            />
          </Row>
        </HalfWidthContainer>
        <HalfWidthContainer>
          <Row>
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
              type={'number'}
              inputMode={'decimal'}
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

        {!!fields.length && <Table tableHeads={additionalExpensesTableHeads} data={fields} />}
        <Footer>
          <Button
            content="Odustani"
            variant="secondary"
            style={{width: 130}}
            onClick={() => navigate('/finance/liabilities-receivables/liabilities/contracts')}
          />
          <Button content="Sačuvaj" variant="primary" onClick={handleSubmit(onSubmit)} disabled={!fields.length} />
        </Footer>
      </>
    </ContractsFormContainer>
  );
};

export default ContractsEntry;
