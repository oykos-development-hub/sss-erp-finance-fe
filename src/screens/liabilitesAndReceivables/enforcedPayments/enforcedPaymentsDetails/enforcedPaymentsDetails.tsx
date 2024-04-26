import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Divider, Dropdown, FileUpload, Input, Table, TableHead, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import FileList from '../../../../components/fileList/fileList.tsx';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetEnforcedPayment from '../../../../services/graphQL/enforcedPayments/useGetEnforcedPayment.ts';
import useInsertEnforcedPayment from '../../../../services/graphQL/enforcedPayments/useInsertEnforcedPayment.ts';
import useReturnEnforcedPayment from '../../../../services/graphQL/enforcedPayments/useReturnEnforcedPayment.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import Footer from '../../../../shared/footer.ts';
import {MainTitle} from '../../../../shared/pageElements.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import {FileResponseItem} from '../../../../types/fileUploadType.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {roundCurrency} from '../../../../utils/roundCurrency.ts';
import {FileListWrapper} from '../../invoices/invoicesOverview/styles.ts';
import {enforcedPaymentSchema} from '../constants.tsx';
import {CaptionWrapper, FileUploadWrapper, FormContainer, ReturnWrapper, Row} from '../styles.ts';

type EnforcedPaymentEntryForm = yup.InferType<typeof enforcedPaymentSchema>;

const EnforcedPaymentsDetails = () => {
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
    reset,
    formState: {errors},
  } = useForm<EnforcedPaymentEntryForm>({
    resolver: yupResolver(enforcedPaymentSchema),
  });

  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);
  const [showFileUploadError, setShowFileUploadError] = useState<boolean>(false);
  const [totalForPayment, setTotalForPayment] = useState<number>();
  const enforcedPaymentID = location.pathname.split('/').at(-1);

  const {organization_unit_id, supplier_id, return_date} = watch();

  const {suppliers} = useGetSuppliers({});
  const {organizationUnits} = useGetOrganizationUnits();
  const {loading: returnLoading, returnEnforcedPayment} = useReturnEnforcedPayment();

  const {enforcedPayment} = useGetEnforcedPayment({
    id: enforcedPaymentID,
    page: 1,
    size: 1,
    status: '',
    search: '',
    organization_unit_id: null,
  });

  const enforcedPaymentData = enforcedPayment[0] ? enforcedPayment[0] : null;

  const {insertEnforcedPayment, loading} = useInsertEnforcedPayment();

  const tableHeads: TableHead[] = [
    {
      title: 'Broj obaveze',
      accessor: 'title',
      type: 'custom',
      renderContents: title => <Typography content={title || ''} />,
    },
    {
      title: 'Plaćeno',
      accessor: 'amount',
      type: 'custom',
      renderContents: amount => <Typography content={amount ? roundCurrency(amount) : ''} />,
    },
    {
      title: 'Konto',
      accessor: 'account',
      type: 'custom',
      renderContents: account => <Typography content={account.title} />,
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const onSubmit = async (data: any) => {
    if (loading) return;
    const payload = {
      id: enforcedPaymentID,
      organization_unit_id: organization_unit_id?.id,
      supplier_id: supplier_id?.id,
      amount: enforcedPaymentData?.amount,
      id_of_statement: data?.id_of_statement,
      date_of_payment: parseDateForBackend(data?.date_of_payment),
      description: data?.description,
      amount_for_lawyer: enforcedPaymentData?.amount_for_lawyer,
      amount_for_agent: enforcedPaymentData?.amount_for_agent,
      date_of_sap: parseDateForBackend(data?.date_of_sap),
      sap_id: data?.sap_id,
    };

    insertEnforcedPayment(
      payload as any,
      () => {
        alert.success('Uspješno ste izmijenili nalog.');
        navigate('/finance/liabilities-receivables/receivables/enforced-payments');
      },
      () => alert.error('Nije moguće izmijeniti nalog.'),
    );
  };

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
    setShowFileUploadError(false);
  };

  const onReturn = async () => {
    if (returnLoading) return;

    if (uploadedFile) {
      setShowFileUploadError(false);

      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(formData, (files: FileResponseItem[]) => {
        setUploadedFile(null);
        const payload = {
          id: enforcedPaymentID,
          return_file_id: files[0].id,
          return_date: return_date && parseDateForBackend(return_date),
        };

        returnEnforcedPayment(
          payload as any,
          () => {
            alert.success('Uspješno ste izvršili povraćaj..');
            navigate('/finance/liabilities-receivables/receivables/enforced-payments');
          },
          () => alert.error('Došlo je do greške. Pokušajte ponovo.'),
        );
      });
    } else {
      setShowFileUploadError(true);
    }
  };

  const calculateTotalForPayment = () => {
    if (enforcedPaymentData) {
      const parsedAmountValue = parseFloat(enforcedPaymentData?.amount.toString());
      const parsedAmountForAgent = parseFloat(enforcedPaymentData?.amount_for_agent.toString());
      const parsedAmountForLawyer = parseFloat(enforcedPaymentData?.amount_for_lawyer.toString());

      const totalForPayment = parsedAmountValue + parsedAmountForAgent + parsedAmountForLawyer;
      return setTotalForPayment(totalForPayment);
    } else {
      return '';
    }
  };

  useEffect(() => {
    calculateTotalForPayment();
    reset({
      amount: enforcedPaymentData?.amount,
      organization_unit_id: {
        id: enforcedPaymentData?.organization_unit?.id,
        title: enforcedPaymentData?.organization_unit?.title,
      },
      supplier_id: {
        id: enforcedPaymentData?.supplier?.id,
        title: enforcedPaymentData?.supplier?.title,
      },
      id_of_statement: enforcedPaymentData?.id_of_statement?.toString(),
      sap_id: enforcedPaymentData?.sap_id,
      description: enforcedPaymentData?.description,
      date_of_sap: enforcedPaymentData?.date_of_sap as Date,
      date_of_payment: enforcedPaymentData?.date_of_payment as Date,
      return_date: enforcedPaymentData?.return_date as Date,
    });
  }, [enforcedPaymentData]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content="PREGLED PRINUDNE NAPLATE" />
        <Divider color="#615959" height="1px" />
        <FormContainer>
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
                  isDisabled={enforcedPaymentData?.status === 'Povraćaj'}
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
                  isDisabled={enforcedPaymentData?.status === 'Povraćaj'}
                />
              )}
            />

            <Input
              {...register('id_of_statement')}
              label="ID NALOGA:"
              error={errors.id_of_statement?.message}
              style={{width: '350px'}}
              disabled={enforcedPaymentData?.status === 'Povraćaj'}
            />
          </Row>
          <Row>
            <Input
              {...register('sap_id')}
              label="SAP ID:"
              error={errors.sap_id?.message}
              style={{width: '350px'}}
              disabled={enforcedPaymentData?.status === 'Povraćaj'}
            />
            <Controller
              name="date_of_sap"
              control={control}
              render={({field: {name, value, onChange}}) => (
                <Datepicker
                  name={name}
                  selected={value ? new Date(value) : ''}
                  label="DATUM SAP-a:"
                  onChange={onChange}
                  disabled={enforcedPaymentData?.status === 'Povraćaj'}
                  error={errors.date_of_sap?.message}
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
                  label="DATUM PLAĆANJA:"
                  onChange={onChange}
                  error={errors.date_of_payment?.message}
                  disabled={enforcedPaymentData?.status === 'Povraćaj'}
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
              disabled={enforcedPaymentData?.status === 'Povraćaj'}
            />
          </Row>
          <CaptionWrapper>
            <Typography variant="bodyMedium" content="POVRAĆAJ:" style={{padding: 5, fontWeight: 700}} />
          </CaptionWrapper>
          <div>
            <Row>
              <Controller
                name="return_date"
                control={control}
                render={({field: {name, value, onChange}}) => (
                  <Datepicker
                    name={name}
                    selected={value ? new Date(value) : ''}
                    label="DATUM POVRAĆAJA:"
                    onChange={onChange}
                    error={errors.return_date?.message}
                    disabled={enforcedPaymentData?.status === 'Povraćaj'}
                  />
                )}
              />
            </Row>

            {enforcedPaymentData?.status !== 'Povraćaj' && (
              <FileUploadWrapper>
                <FileUpload
                  icon={null}
                  files={uploadedFile}
                  variant="secondary"
                  onUpload={handleUpload}
                  note={<Typography variant="bodySmall" content="Povraćaj" />}
                  hint={'Fajlovi neće biti učitani dok ne sačuvate povraćaj.'}
                  buttonText="Učitaj"
                  error={showFileUploadError ? 'Morate učitati fajl' : undefined}
                />
              </FileUploadWrapper>
            )}
            {enforcedPaymentData?.status === 'Povraćaj' && (
              <FileListWrapper>
                <Typography variant="bodySmall" style={{fontWeight: 600}} content={'POVRAĆAJ:'} />
                <FileList files={(enforcedPaymentData && [enforcedPaymentData.return_file]) ?? []} />
              </FileListWrapper>
            )}

            {enforcedPaymentData?.status !== 'Povraćaj' && (
              <ReturnWrapper>
                <Button content="Sačuvaj" variant="primary" onClick={() => onReturn()} />
              </ReturnWrapper>
            )}
          </div>

          <Row>
            <Input
              label="Iznos za plaćanje:"
              value={roundCurrency(enforcedPaymentData?.amount)}
              style={{width: '250px'}}
              disabled
            />
            <Input
              label="Troškovi advokata:"
              value={roundCurrency(enforcedPaymentData?.amount_for_lawyer)}
              style={{width: '250px'}}
              disabled
            />
            <Input
              label="Troškovi izvršitelja:"
              value={roundCurrency(enforcedPaymentData?.amount_for_agent)}
              style={{width: '250px'}}
              disabled
            />
            <Input
              label="Ukupno za plaćanje:"
              value={roundCurrency(totalForPayment)}
              style={{width: '250px'}}
              disabled
            />
          </Row>

          <Table tableHeads={tableHeads} data={enforcedPaymentData?.items || []} />

          <Footer>
            <Button
              content="Odustani"
              variant="secondary"
              style={{width: 130}}
              onClick={() => navigate('/finance/liabilities-receivables/receivables/enforced-payments')}
            />

            <Button
              content="Sačuvaj"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={enforcedPaymentData?.status === 'Povraćaj'}
            />
          </Footer>
        </FormContainer>
      </SectionBox>
    </ScreenWrapper>
  );
};

export default EnforcedPaymentsDetails;
