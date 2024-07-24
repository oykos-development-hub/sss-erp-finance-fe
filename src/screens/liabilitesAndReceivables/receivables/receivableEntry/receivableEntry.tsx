import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, Input, Table, TableHead, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {StatusOptions} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import useGetObligations from '../../../../services/graphQL/receivables/useGetObligations.ts';
import useInsertPaymentOrder from '../../../../services/graphQL/receivables/useInsertPaymentOrder.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import Footer from '../../../../shared/footer.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import StatusTableCell from '../../../../shared/statusTableCell/statusTableCell.tsx';
import {Items} from '../../../../types/graphQL/receivablesTypes.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {formatCurrency} from '../../../../utils/currencyUtils.ts';
import {TypesForReceivables, receivableSchema, sourceOfFunding} from '../constants.tsx';
import {ReceivableFormContainer, Row} from '../styles.ts';
import ReceivableSingleModal from '../../../../components/receivableModal/receivableSingleModal.tsx';
import ReceivablesModal from '../../../../components/receivableModal/receivablesModal.tsx';

type ReceivableEntryForm = yup.InferType<typeof receivableSchema>;

const ReceivableEntry = () => {
  const {
    alert,
    navigation: {navigate, location},
    contextMain: {organization_unit},
  } = useAppContext();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: {errors},
    setError,
    setValue,
    clearErrors,
  } = useForm<ReceivableEntryForm>({
    resolver: yupResolver(receivableSchema),
  });

  const paymentID = location.pathname.split('/').at(-1);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [amountValue, setAmountValue] = useState<number>();
  const [totalAmount, setTotalAmount] = useState<string>();
  const [manualAmount, setManualAmount] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const {organization_unit_id, supplier_id, type, amount} = watch();

  const {suppliers} = useGetSuppliers({});
  const {organizationUnits} = useGetOrganizationUnits();
  const {obligations, fetchObligations} = useGetObligations({
    supplier_id: supplier_id?.id ? supplier_id?.id : null,
    organization_unit_id: organization_unit_id?.id ? organization_unit_id.id : null,
    type: type?.id ? type?.id : null,
  });

  useEffect(() => {
    if (!organization_unit) return;
    setValue('organization_unit_id', organization_unit);
  }, [organization_unit]);

  const {insertPaymentOrder, loading} = useInsertPaymentOrder();

  const getObligations = () => {
    setSelectedRows([]);
    setValue('items', []);
    fetchObligations(() => alert.error('Za izabranu opciju nema rezultata.'));
  };

  const {fields, remove, insert} = useFieldArray({
    control,
    name: 'items',
    keyName: 'key',
  });

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
      renderContents: total_price => <Typography content={formatCurrency(total_price)} />,
    },
    {
      title: 'Preostalo za plaćanje',
      accessor: 'remain_price',
      type: 'custom',
      renderContents: remain_price => <Typography content={formatCurrency(remain_price)} />,
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

  const validateAmount = (fields: any, amount?: number | null) => {
    const selectedRow = fields.filter((field: Items) => selectedRows.includes(field.id));

    if (amount && amount > selectedRow[0].remain_price) {
      setError('amount', {
        type: 'manual',
        message: 'Iznos ne može biti veći od cijene za plaćanje.',
      });
      return false;
    } else {
      clearErrors('amount');
    }

    return true;
  };

  const [updatedItems, setUpdatedItems] = useState<any[]>([]);

  const handleModalSubmit = (formData?: any, additionalData?: any) => {
    setUpdatedItems(formData?.items);
    setManualAmount(additionalData?.manualAmount);
    setTotalAmount(additionalData?.totalAmount);
    setAmountValue(additionalData?.amountValue);
  };

  const onSubmit = async (data: any) => {
    if (loading) return;

    const isValidAmount = validateAmount(fields, amount);
    if (!isValidAmount) {
      return;
    }

    if (selectedRows.length === 1) {
      const field = fields.filter(field => selectedRows.includes(field.id));
      let amount: number | null | undefined;

      if (selectedRows.length > 1) {
        amount = Number(amountValue);
      } else if (manualAmount) {
        amount = parseFloat(manualAmount.replace(',', '.'));
      } else if (totalAmount) {
        amount = parseFloat(totalAmount);
      } else if (selectedRows[0]?.status === 'Djelimično na nalogu') {
        amount = amountValue;
      } else {
        amount = null;
      }

      const payload = {
        organization_unit_id: organization_unit_id?.id,
        supplier_id: supplier_id?.id,
        amount: amount,
        date_of_payment: parseDateForBackend(data?.date_of_payment),
        description: data?.description,
        source_of_funding: data?.source_of_funding?.id,
        items: updatedItems.map(item => ({
          invoice_id: field[0]?.invoice_id || null,
          additional_expense_id: field[0]?.additional_expense_id || null,
          salary_additional_expense_id: field[0]?.salary_additional_expense_id || null,
          source_account_id: item?.account?.id || null,
          account_id: item?.source_account?.id,
          amount: updatedItems.length === 1 && amount !== null && amount !== undefined ? amount : item?.remain_price,
        })),
      };

      insertPaymentOrder(
        payload as any,
        () => {
          alert.success('Uspješno ste kreirali nalog za plaćanje.');
          navigate('/finance/liabilities-receivables/receivables/payment-orders');
        },
        message =>
          message ===
          'make api request: backend error: API error: 500 - upper tx: repo current budget update balance: insufficient funds'
            ? alert.error('Nemate dovoljno novca na ovom kontu.')
            : alert.error('Neuspješno dodavanje naloga.'),
      );
    } else {
      const payload = {
        organization_unit_id: organization_unit_id?.id,
        supplier_id: supplier_id?.id,
        amount: amount,
        date_of_payment: parseDateForBackend(data?.date_of_payment),
        description: data?.description,
        source_of_funding: data?.source_of_funding?.id,
        items: updatedItems.map(item => ({
          invoice_id: item?.invoice_id || null,
          additional_expense_id: item?.additional_expense_id || null,
          salary_additional_expense_id: item?.salary_additional_expense_id || null,
          account_id: item?.source_account?.id,
          amount: item?.remain_price,
        })),
      };

      insertPaymentOrder(
        payload as any,
        () => {
          alert.success('Uspješno ste kreirali nalog za plaćanje.');
          navigate('/finance/liabilities-receivables/receivables/payment-orders');
        },
        () => alert.error('Neuspješno dodavanje naloga.'),
      );
    }

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

  useEffect(() => {
    if (obligations) {
      if (obligations.length) {
        for (let i = obligations.length - 1; i >= 0; i--) {
          remove(i);
        }

        obligations.forEach((obligation, index) => {
          insert(index, {
            ...obligation,
            id: Math.random(),
          });
        });
      }
    }
  }, [obligations]);

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
                      <div style={{width: '250px'}}>
                        <Dropdown
                          name={name}
                          value={value}
                          onChange={onChange}
                          label="IZVOR SREDSTAVA:"
                          options={sourceOfFunding}
                          error={errors.source_of_funding?.message}
                          isSearchable
                        />
                      </div>
                    )}
                  />
                  {paymentID > 0 && (
                    <Input
                      {...register('id_of_statement')}
                      label="ID NALOGA:"
                      error={errors.id_of_statement?.message}
                      style={{width: '250px'}}
                      disabled
                    />
                  )}
                  <Input
                    {...register('sap_id')}
                    label="SAP ID:"
                    disabled
                    error={errors.sap_id?.message}
                    style={{width: '250px'}}
                  />

                  <Controller
                    name={'date_of_sap'}
                    control={control}
                    render={({field: {name, value, onChange}}) => (
                      <Datepicker
                        name={name}
                        disabled
                        selected={value ? new Date(value) : ''}
                        label="SAP DATUM:"
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
                  <Button
                    content="Izlistaj"
                    variant="secondary"
                    style={{width: 130}}
                    onClick={() => setShowModal(prevState => !prevState)}
                    disabled={!selectedRows.length}
                  />
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

            {showModal && selectedRows.length === 1 && (
              <ReceivableSingleModal
                onClose={() => setShowModal(false)}
                open={showModal}
                data={fields}
                selectedRow={selectedRows}
                onSubmit={handleModalSubmit}
              />
            )}

            {((showModal && selectedRows.length >= 2) || selectedRows[0]?.status === 'Djelimično na nalogu') && (
              <ReceivablesModal
                onClose={() => setShowModal(false)}
                open={showModal}
                data={fields}
                selectedRow={selectedRows}
                onSubmit={handleModalSubmit}
              />
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
                  disabled={!updatedItems?.length}
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
