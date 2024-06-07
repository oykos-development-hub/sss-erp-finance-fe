import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, FileUpload, Input, Table, TableHead, Typography} from 'client-library';
import {useEffect, useMemo, useState} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {generateDropdownOptions} from '../../../../constants.ts';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetCountOverview from '../../../../services/graphQL/counts/useGetCountOverview.ts';
import useInsertEnforcedPayment from '../../../../services/graphQL/enforcedPayments/useInsertEnforcedPayment.ts';
import useGetInvoice from '../../../../services/graphQL/invoice/useGetInvoice.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import {ConfirmationModal} from '../../../../shared/confirmationModal/confirmationModal.tsx';
import Footer from '../../../../shared/footer.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import StatusTableCell from '../../../../shared/statusTableCell/statusTableCell.tsx';
import {FileResponseItem} from '../../../../types/fileUploadType.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {roundCurrency} from '../../../../utils/roundCurrency.ts';
import {StatusOptionsInvoice} from '../../invoices/constants.tsx';
import {TypesTitles, enforcedPaymentSchema} from '../constants.tsx';
import {FileUploadWrapper, FormContainer, Row} from '../styles.ts';

type EnforcedPaymentEntryForm = yup.InferType<typeof enforcedPaymentSchema>;

const EnforcedPaymentEntry = () => {
  const {
    alert,
    navigation: {navigate, location},
    fileService: {uploadFile},
  } = useAppContext();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: {errors},
    setError,
    clearErrors,
  } = useForm<EnforcedPaymentEntryForm>({
    defaultValues: {amount_for_bank: roundCurrency(15)},
    resolver: yupResolver(enforcedPaymentSchema),
  });
  const enforcedPaymentID = location.pathname.split('/').at(-1);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<string>();
  const [manualAmount, setManualAmount] = useState<string | null>(null);
  const [totalForPayment, setTotalForPayment] = useState<number>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);

  const {organization_unit_id, supplier_id, amount_for_agent, amount_for_lawyer, agent_id, amount_for_bank} = watch();

  const {counts} = useGetCountOverview({level: 3});
  const {suppliers} = useGetSuppliers({});
  const {suppliers: executor} = useGetSuppliers({entity: 'executor'});

  const {organizationUnits} = useGetOrganizationUnits();
  const {invoice, fetchInvoice} = useGetInvoice(
    {
      supplier_id: supplier_id?.id ? supplier_id?.id : null,
      organization_unit_id: organization_unit_id?.id ? organization_unit_id.id : undefined,
    },
    true,
  );

  const {insertEnforcedPayment, loading} = useInsertEnforcedPayment();

  const getInvoice = () => {
    fetchInvoice(() => alert.error('Za izabranu opciju nema rezultata.'));
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
        const typeValue = TypesTitles.find(option => option.id === row.type);
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
      renderContents: total_price => <Typography content={total_price ? roundCurrency(total_price) : ''} />,
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
                error={errors.items?.[index]?.account?.message}
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
        const statusValue = StatusOptionsInvoice.find(option => option.id === row.status);
        return <StatusTableCell status={statusValue ? statusValue?.title : ''} />;
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const onSubmit = async (data: any) => {
    if (loading) return;
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(formData, (files: FileResponseItem[]) => {
        setUploadedFile(null);
        const payload = {
          organization_unit_id: organization_unit_id?.id,
          supplier_id: supplier_id?.id,
          amount: manualAmount ? parseFloat(manualAmount) : totalAmount ? parseFloat(totalAmount) : null,
          date_of_payment: parseDateForBackend(data?.date_of_payment),
          description: data?.description,
          amount_for_lawyer: data?.amount_for_lawyer,
          amount_for_agent: data?.amount_for_agent,
          date_of_sap: parseDateForBackend(data?.date_of_sap),
          sap_id: data?.sap_id,
          agent_id: agent_id?.id,
          execution_number: data?.execution_number,
          file_id: files[0].id,
          amount_for_bank: parseFloat(data?.amount_for_bank),
          items: fields
            .filter(field => selectedRows.includes(field.id))
            .map(item => ({
              invoice_id: item?.invoice_id || null,
              account_id: item?.account?.id || null,
            })),
        };

        insertEnforcedPayment(
          payload,
          () => {
            alert.success('Uspješno dodavanje naloga.');
            navigate('/finance/liabilities-receivables/receivables/enforced-payments');
          },
          () => alert.error('Neuspješno dodavanje naloga.'),
        );
      });

      return;
    } else {
      const payload = {
        organization_unit_id: organization_unit_id?.id,
        supplier_id: supplier_id?.id,
        amount: manualAmount ? parseFloat(manualAmount) : totalAmount ? parseFloat(totalAmount) : null,
        date_of_payment: parseDateForBackend(data?.date_of_payment),
        description: data?.description,
        amount_for_lawyer: data?.amount_for_lawyer,
        agent_id: agent_id?.id,
        execution_number: data?.execution_number,
        amount_for_agent: data?.amount_for_agent,
        date_of_sap: parseDateForBackend(data?.date_of_sap),
        amount_for_bank: parseFloat(data?.amount_for_bank),
        sap_id: data?.sap_id,
        items: fields
          .filter(field => selectedRows.includes(field.id))
          .map(item => ({
            invoice_id: item?.invoice_id || null,
            account_id: item?.account?.id || null,
          })),
      };

      insertEnforcedPayment(
        payload,
        () => {
          alert.success('Uspješno dodavanje naloga.');
          navigate('/finance/liabilities-receivables/receivables/enforced-payments');
        },
        () => alert.error('Neuspješno dodavanje naloga.'),
      );

      return;
    }
  };

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };

  const onCheck = (checked: boolean, currId: number | null) => {
    if (checked && currId) {
      setSelectedRows([...selectedRows, currId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== currId));
    }
  };

  const calculateTotalPrice = () => {
    if (manualAmount !== null) {
      setManualAmount(manualAmount);
    } else {
      const relevantFields = fields.filter(field => selectedRows.includes(field.id));

      let totalRemainingPrice = 0;
      relevantFields.forEach(field => {
        totalRemainingPrice += field.total_price || 0;
      });

      setTotalAmount(roundCurrency(totalRemainingPrice));
    }
  };

  const calculateTotalForPayment = () => {
    if (totalAmount && amount_for_agent && amount_for_lawyer && amount_for_bank) {
      const parsedAmountValue = parseFloat(totalAmount.toString());
      const parsedAmountForAgent = parseFloat(amount_for_agent.toString());
      const parsedAmountForLawyer = parseFloat(amount_for_lawyer.toString());
      const parsedAmountForBank = parseFloat(amount_for_bank);

      const totalForPayment = parsedAmountValue + parsedAmountForAgent + parsedAmountForLawyer + parsedAmountForBank;
      return setTotalForPayment(totalForPayment);
    } else {
      return '';
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAmountChange = (e: any) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setManualAmount('');
      clearErrors('amount');
    } else {
      if (totalAmount) {
        if (value > parseFloat(totalAmount)) {
          setError('amount', {
            type: 'manual',
            message: 'Iznos za plaćanje ne može biti veći od ukupnog iznosa.',
          });
        } else {
          clearErrors('amount');
        }
      }
      setManualAmount(e.target.value);
    }
  };

  useEffect(() => {
    if (invoice) {
      if (invoice && invoice.length) {
        for (let i = fields.length - 1; i >= 0; i--) {
          remove(i);
        }

        invoice.forEach((article, index) => {
          insert(index, {
            id: Math.random(),
            invoice_id: article.id,
            title: article.invoice_number,
            total_price: article.net_price + article.vat_price,
            account: null,
            status: article.status,
            type: article.type,
          });
        });
      }
    }
  }, [invoice]);

  useEffect(() => {
    calculateTotalPrice();
    calculateTotalForPayment();
  }, [selectedRows, amount_for_agent, amount_for_lawyer]);

  const onSaveClick = () => {
    setShowModal(true);
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <FormContainer>
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

              <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <Button
                  content="Prikaži"
                  variant="primary"
                  onClick={() => getInvoice()}
                  disabled={!supplier_id || !organization_unit_id}
                />
              </div>
            </Row>
            {!!fields.length && (
              <>
                <>
                  <Row>
                    <Input
                      {...register('execution_number')}
                      label="BROJ IZVRŠENJA:"
                      error={errors.sap_id?.message}
                      style={{width: '350px'}}
                    />
                    <Controller
                      name={'agent_id'}
                      control={control}
                      render={({field: {name, value, onChange}}) => (
                        <Dropdown
                          name={name}
                          label="IZVRŠITELJ:"
                          value={value}
                          onChange={onChange}
                          error={errors.date_of_payment?.message}
                          options={executor}
                        />
                      )}
                    />

                    <Input
                      {...register('sap_id')}
                      label="SAP ID:"
                      error={errors.sap_id?.message}
                      style={{width: '350px'}}
                      isRequired
                    />
                  </Row>
                  <Row>
                    {enforcedPaymentID > 0 && (
                      <Input
                        {...register('id_of_statement')}
                        label="ID NALOGA:"
                        error={errors.id_of_statement?.message}
                        style={{width: '350px'}}
                        disabled
                      />
                    )}

                    <Controller
                      name={'date_of_sap'}
                      control={control}
                      render={({field: {name, value, onChange}}) => (
                        <Datepicker
                          name={name}
                          selected={value ? new Date(value) : ''}
                          label="DATUM SAP-a:"
                          isRequired
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
                          isRequired
                          error={errors.date_of_payment?.message}
                        />
                      )}
                    />
                  </Row>
                  <Row>
                    <FileUploadWrapper>
                      <FileUpload
                        icon={null}
                        files={uploadedFile}
                        variant="secondary"
                        onUpload={handleUpload}
                        note={<Typography variant="bodySmall" content="Dokument" />}
                        hint={'Fajlovi neće biti učitani dok ne sačuvate prinudnu naplatu.'}
                        buttonText="Učitaj"
                      />
                    </FileUploadWrapper>
                  </Row>
                  <Row>
                    <Input {...register('description')} label="OPIS:" textarea placeholder="Unesite opis" />
                  </Row>
                </>
                <>
                  <div>
                    {!!selectedRows.length && (
                      <>
                        <Row>
                          <Input
                            {...register('amount')}
                            label="Iznos za plaćanje:"
                            error={errors.amount?.message}
                            value={manualAmount !== null ? manualAmount : totalAmount ? totalAmount : ''}
                            style={{width: '250px'}}
                            onChange={handleAmountChange}
                          />

                          <Input
                            {...register('amount_for_lawyer')}
                            label="Troškovi advokata:"
                            error={errors.amount_for_lawyer?.message}
                            style={{width: '250px'}}
                            isRequired
                          />
                        </Row>

                        <Row>
                          <Input
                            {...register('amount_for_agent')}
                            label="Troškovi izvršitelja:"
                            error={errors.amount_for_agent?.message}
                            style={{width: '250px'}}
                            isRequired
                          />
                          <Input
                            {...register('amount_for_bank')}
                            label="Naknada Centralne banke:"
                            error={errors.amount_for_agent?.message}
                            style={{width: '250px'}}
                            isRequired
                          />
                        </Row>

                        <Row>
                          <Input
                            label="Ukupno za plaćanje:"
                            value={totalForPayment ? roundCurrency(totalForPayment) : ''}
                            style={{width: '250px'}}
                            disabled
                          />
                        </Row>
                      </>
                    )}
                  </div>
                  <Table
                    tableHeads={receivableTableHeads}
                    data={fields}
                    checkedRows={selectedRows}
                    checkboxes
                    onCheck={onCheck}
                  />
                </>
              </>
            )}

            <Footer>
              <Button
                content="Odustani"
                variant="secondary"
                style={{width: 130}}
                onClick={() => navigate('/finance/liabilities-receivables/receivables/enforced-payments')}
              />

              {!!fields.length && (
                <Button
                  content="Sačuvaj"
                  variant="primary"
                  onClick={handleSubmit(onSaveClick)}
                  disabled={!fields.length}
                />
              )}
            </Footer>
          </>
        </FormContainer>
        <ConfirmationModal
          open={!!showModal}
          subTitle="Odabrane obaveze će biti evidentirane kroz prinudnu naplatu."
          onClose={() => handleCloseModal()}
          onConfirm={handleSubmit(onSubmit)}
        />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default EnforcedPaymentEntry;
