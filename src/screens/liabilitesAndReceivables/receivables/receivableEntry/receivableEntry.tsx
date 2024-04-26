import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, Input, Table, TableHead, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {StatusOptions, generateDropdownOptions} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import useGetObligations from '../../../../services/graphQL/receivables/useGetObligations.ts';
import useInsertPaymentOrder from '../../../../services/graphQL/receivables/useInsertPaymentOrder.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import Footer from '../../../../shared/footer.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import StatusTableCell from '../../../../shared/statusTableCell/statusTableCell.tsx';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {roundCurrency} from '../../../../utils/roundCurrency.ts';
import {TypesForReceivables, receivableSchema, sourceOfFunding} from '../constants.tsx';
import {ReceivableFormContainer, Row} from '../styles.ts';

type ReceivableEntryForm = yup.InferType<typeof receivableSchema>;

const ReceivableEntry = () => {
  const {
    alert,
    navigation: {navigate},
  } = useAppContext();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<ReceivableEntryForm>({
    resolver: yupResolver(receivableSchema),
  });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [amountValue, setAmountValue] = useState<number>();

  const {organization_unit_id, supplier_id, type, amount} = watch();

  const {counts} = useGetCountOverview({level: 3});
  const {suppliers} = useGetSuppliers({});
  const {organizationUnits} = useGetOrganizationUnits();
  const {obligations, fetchObligations} = useGetObligations({
    supplier_id: supplier_id?.id ? supplier_id?.id : null,
    organization_unit_id: organization_unit_id?.id ? organization_unit_id.id : null,
    type: type?.id ? type?.id : null,
  });

  const {insertPaymentOrder, loading} = useInsertPaymentOrder();

  const getObligations = () => {
    fetchObligations(() => alert.error('Za izabranu opciju nema rezultata.'));
  };

  const {fields, remove, insert} = useFieldArray({
    control,
    name: 'items',
    keyName: 'key',
  });

  const dropdowncountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const receivableTableHeads: TableHead[] = [
    {
      title: 'Tip obaveze',
      accessor: 'type',
      type: 'custom',
      renderContents: (_, row) => {
        const typeValue = TypesForReceivables.find(option => option.id === row.type);
        return <Typography content={typeValue ? typeValue?.title : ''} />;
      },
    },
    {
      title: 'Broj obaveze',
      accessor: 'title',
      type: 'custom',
      renderContents: title => <Typography content={title || ''} />,
    },
    {
      title: 'Ukupni iznos',
      accessor: 'total_price',
      type: 'custom',
      renderContents: total_price => <Typography content={roundCurrency(total_price)} />,
    },
    {
      title: 'Preostalo da se plati',
      accessor: 'remain_price',
      type: 'custom',
      renderContents: remain_price => <Typography content={roundCurrency(remain_price)} />,
    },
    {
      title: 'Konto',
      accessor: 'account',
      type: 'custom',
      renderContents: (_item, row, index) => (
        <Controller
          name={`items.${index}.account`}
          control={control}
          render={({field: {onChange, name, value}}) => (
            <div style={{minWidth: '200px'}}>
              <Dropdown
                options={dropdowncountsOptions}
                name={name}
                value={value}
                onChange={onChange}
                error={errors?.items?.[index]?.account?.message}
                isDisabled={selectedRows && selectedRows.every(option => option !== row.id)}
              />
            </div>
          )}
        />
      ),
    },
    {
      title: 'Status',
      accessor: 'status',
      type: 'custom',
      renderContents: (_, row) => {
        const statusValue = StatusOptions.find(option => option.id === row.status);
        return <StatusTableCell status={statusValue ? statusValue?.title : ''} />;
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const onSubmit = async (data: any) => {
    if (loading) return;

    const payload = {
      organization_unit_id: organization_unit_id?.id,
      supplier_id: supplier_id?.id,
      amount: selectedRows.length > 1 ? Number(amountValue) : amount,
      id_of_statement: data?.id_of_statement,
      date_of_payment: parseDateForBackend(data?.date_of_payment),
      description: data?.description,
      source_of_funding: data?.source_of_funding?.id,
      items: fields
        .filter(field => selectedRows.includes(field.id))
        .map((_, index) => ({
          invoice_id: data.items[index]?.invoice_id,
          additional_expense_id: data.items[index]?.additional_expense_id,
          salary_additional_expense_id: data.items[index]?.salary_additional_expense_id,
          account_id: data.items[index]?.account?.id,
        })),
    };

    insertPaymentOrder(
      payload,
      () => {
        alert.success('Uspješno dodavanje naloga.');
        navigate('/finance/liabilities-receivables/receivables');
      },
      () => alert.error('Neuspješno dodavanje naloga.'),
    );

    return;
  };

  const onCheck = (checked: boolean, currId: number | null) => {
    if (checked && currId) {
      setSelectedRows([...selectedRows, currId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== currId));
    }
  };

  const areItemsDisabled = (): ((row: any) => boolean) => {
    const isStatusPartiallyCreated = (status: string | undefined) => status === 'Djelimično na nalogu';
    const isStatusCreated = (status: string | undefined) => status === 'Kreiran';

    const firstSelectedItem = fields.find(field => selectedRows.includes(field.id));
    if (!firstSelectedItem) return () => false; // Ako nema selektovanih itema onda je sve enabled

    const firstSelectedItemStatus = firstSelectedItem.status;

    // Ako prvi item u selectedRows ima status Kreiran onda su disabled samo oni koji imaju status Djelimično na nalogu
    if (isStatusCreated(firstSelectedItemStatus)) {
      return (row: any) => {
        if (selectedRows.includes(row.id)) {
          return false; // Prvi selektovani item nije disabled
        }
        if (isStatusPartiallyCreated(row.status)) {
          return true; // Vraćamo true za sve iteme sa statusom Djelimično na čekanju osim za prvi selektovani
        }
        return false;
      };
    }

    // Ako je prvi selektovani item sa statusom Djelimično na nalogu, onda treba onemogućiti sve iteme osim prvog selektovanog
    if (isStatusPartiallyCreated(firstSelectedItemStatus)) {
      return (row: any) => {
        if (selectedRows.includes(row.id)) {
          return false; // Prvi selektovani item nije disabled
        }
        return true; // Svi ostali itemi će biti disabled
      };
    }

    return () => false;
  };

  const calculateTotalRemainingPrice = () => {
    const relevantFields = fields.filter(field => selectedRows.includes(field.id));

    let totalRemainingPrice = 0;
    relevantFields.forEach(field => {
      totalRemainingPrice += field.remain_price || 0;
    });

    return setAmountValue(totalRemainingPrice);
  };

  useEffect(() => {
    if (obligations) {
      if (obligations && obligations.length) {
        for (let i = fields.length - 1; i >= 0; i--) {
          remove(i);
        }

        obligations.forEach((article, index) => {
          insert(index, {
            id: Math.random(),
            additional_expense_id: article.additional_expense_id,
            salary_additional_expense_id: article.salary_additional_expense_id,
            invoice_id: article.invoice_id,
            title: article.title,
            total_price: article.total_price,
            remain_price: article.remain_price,
            account: null,
            status: article.status,
            type: article.type,
          });
        });
      }
    }
  }, [obligations]);

  useEffect(() => {
    calculateTotalRemainingPrice();
  }, [selectedRows]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <ReceivableFormContainer>
          <>
            <Row>
              <Controller
                name="organization_unit_id"
                control={control}
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    name={name}
                    value={value}
                    onChange={onChange}
                    label="ORGANIZACIONA JEDINICA:"
                    options={organizationUnits}
                    error={errors.supplier_id?.message}
                    isSearchable
                    isRequired
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
                    options={suppliers}
                    error={errors.supplier_id?.message}
                    isSearchable
                    isRequired
                  />
                )}
              />
              <Controller
                name="type"
                control={control}
                render={({field: {name, value, onChange}}) => (
                  <Dropdown
                    name={name}
                    value={value}
                    onChange={onChange}
                    label="TIP:"
                    options={TypesForReceivables}
                    error={errors.type?.message}
                  />
                )}
              />
              <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <Button
                  content="Prikaži"
                  variant="primary"
                  onClick={() => getObligations()}
                  disabled={!supplier_id || !organization_unit_id}
                />
              </div>
            </Row>
            {!!fields.length && (
              <>
                <Row>
                  <Controller
                    name="source_of_funding"
                    control={control}
                    render={({field: {name, value, onChange}}) => (
                      <Dropdown
                        name={name}
                        value={value}
                        onChange={onChange}
                        label="IZVOR SREDSTAVA:"
                        options={sourceOfFunding}
                        error={errors.source_of_funding?.message}
                        isSearchable
                      />
                    )}
                  />
                  <Input
                    {...register('id_of_statement')}
                    label="ID NALOGA:"
                    error={errors.id_of_statement?.message}
                    style={{width: '350px'}}
                  />
                  <Input
                    {...register('sap_id')}
                    label="SAP ID:"
                    disabled
                    error={errors.sap_id?.message}
                    style={{width: '350px'}}
                  />
                </Row>
                <Row>
                  <Controller
                    name={'date_of_sap'}
                    control={control}
                    render={({field: {name, value, onChange}}) => (
                      <Datepicker
                        name={name}
                        disabled
                        selected={value ? new Date(value) : ''}
                        label="DATUM SAP:"
                        onChange={onChange}
                        error={errors.date_of_sap?.message}
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
                        label="DATUM PLAĆANJA:"
                        onChange={onChange}
                        error={errors.date_of_payment?.message}
                      />
                    )}
                  />
                </Row>
                <Row>
                  <Input {...register('description')} label="OPIS:" textarea placeholder="Unesite opis" />
                </Row>
              </>
            )}

            {!!fields.length && (
              <>
                <Row>
                  {selectedRows.length === 1 && (
                    <Input
                      {...register('amount')}
                      label="Iznos za plaćanje:"
                      error={errors.amount?.message}
                      style={{width: '250px'}}
                    />
                  )}
                  {selectedRows.length > 1 && (
                    <Input
                      {...register('amount')}
                      label="Iznos za placanje:"
                      disabled
                      value={roundCurrency(amountValue)}
                      error={errors.amount?.message}
                      style={{width: '250px'}}
                    />
                  )}
                </Row>
                <Table
                  tableHeads={receivableTableHeads}
                  data={fields}
                  checkedRows={selectedRows}
                  checkboxes
                  onCheck={onCheck}
                  disabledCheckbox={areItemsDisabled()}
                />
              </>
            )}

            <Footer>
              <Button
                content="Odustani"
                variant="secondary"
                style={{width: 130}}
                onClick={() => navigate('/finance/liabilities-receivables/receivables')}
              />

              {!!fields.length && (
                <Button
                  content="Sačuvaj"
                  variant="primary"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!fields.length}
                />
              )}
            </Footer>
          </>
        </ReceivableFormContainer>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ReceivableEntry;
