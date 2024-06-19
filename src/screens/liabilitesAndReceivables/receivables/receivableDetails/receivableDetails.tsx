import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Datepicker, Dropdown, Input, Table, TableHead, Typography} from 'client-library';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import PayOrderModal from '../../../../components/payOrderModal/payOrderModal.tsx';
import useAppContext from '../../../../context/useAppContext.ts';
import useGetOrganizationUnits from '../../../../services/graphQL/organizationUnits/useGetOrganizationUnits.ts';
import useGetPaymentOrder from '../../../../services/graphQL/receivables/useGetPaymentOrder.ts';
import useInsertPaymentOrder from '../../../../services/graphQL/receivables/useInsertPaymentOrder.ts';
import useGetSuppliers from '../../../../services/graphQL/suppliers/useGetSuppliers.ts';
import Footer from '../../../../shared/footer.ts';
import ScreenWrapper from '../../../../shared/screenWrapper/screenWrapper.tsx';
import SectionBox from '../../../../shared/sectionBox.ts';
import {parseDateForBackend} from '../../../../utils/dateUtils.ts';
import {TypesForReceivables, receivableSchema, sourceOfFunding} from '../constants.tsx';
import {ButtonWrapper, ReceivableFormContainer, Row} from '../styles.ts';
import {roundCurrency} from '../../../../utils/roundCurrency.ts';

type ReceivableEntryForm = yup.InferType<typeof receivableSchema>;

const ReceivableDetails = () => {
  const {
    alert,
    navigation: {navigate, location},
  } = useAppContext();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: {errors},
  } = useForm<ReceivableEntryForm>({
    resolver: yupResolver(receivableSchema),
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const receivableID = location.pathname.split('/').at(-1);

  const {organization_unit_id, supplier_id} = watch();

  const {suppliers} = useGetSuppliers({});
  const {organizationUnits} = useGetOrganizationUnits();

  const {paymentOrder} = useGetPaymentOrder({
    page: 1,
    size: 1,
    id: receivableID,
    status: '',
    year: null,
    search: '',
    organization_unit_id: null,
  });

  const paymentData = paymentOrder[0] ? paymentOrder[0] : null;

  const {insertPaymentOrder, loading} = useInsertPaymentOrder();

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
      title: 'Plaćeno',
      accessor: 'amount',
      type: 'custom',
      renderContents: amount => <Typography content={roundCurrency(amount) || ''} />,
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
      id: receivableID,
      organization_unit_id: organization_unit_id?.id,
      supplier_id: supplier_id?.id,
      amount: data?.amount,
      id_of_statement: paymentData?.id_of_statement,
      date_of_payment: parseDateForBackend(data?.date_of_payment),
      description: data?.description,
    };

    insertPaymentOrder(
      payload as any,
      () => {
        alert.success('Uspješno dodavanje naloga.');
        navigate('/finance/liabilities-receivables/receivables/payment-orders');
      },
      () => alert.error('Neuspješno dodavanje naloga.'),
    );

    return;
  };

  useEffect(() => {
    reset({
      amount: paymentData?.amount,
      organization_unit_id: {
        id: paymentData?.organization_unit?.id,
        title: paymentData?.organization_unit?.title,
      },
      supplier_id: {
        id: paymentData?.supplier?.id,
        title: paymentData?.supplier?.title,
      },
      id_of_statement: paymentData?.id_of_statement?.toString(),
      sap_id: paymentData?.sap_id,
      description: paymentData?.description,
      date_of_sap: paymentData?.date_of_sap as Date,
      date_of_payment: paymentData?.date_of_payment as Date,
      source_of_funding: {id: paymentData?.source_of_funding, title: paymentData?.source_of_funding},
    });
  }, [paymentData]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <ReceivableFormContainer>
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
                  isDisabled={paymentData?.status === 'Plaćen'}
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
                  isDisabled={paymentData?.status === 'Plaćen'}
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
                  label="IZVOR SREDSTAVA:"
                  options={sourceOfFunding}
                  error={errors.supplier_id?.message}
                  isSearchable
                  isDisabled={paymentData?.status === 'Plaćen'}
                />
              )}
            />
            <Input
              {...register('id_of_statement')}
              label="ID NALOGA:"
              error={errors.id_of_statement?.message}
              style={{width: '350px'}}
              disabled={paymentData?.status === 'Plaćen'}
            />
          </Row>
          <Row>
            <Input
              {...register('sap_id')}
              label="SAP ID:"
              disabled
              error={errors.sap_id?.message}
              style={{width: '350px'}}
            />
            <Controller
              name="date_of_sap"
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
              name="date_of_payment"
              control={control}
              render={({field: {name, value, onChange}}) => (
                <Datepicker
                  name={name}
                  selected={value ? new Date(value) : ''}
                  label="DATUM PLAĆANJA:"
                  onChange={onChange}
                  error={errors.date_of_payment?.message}
                  disabled={paymentData?.status === 'Plaćen'}
                />
              )}
            />
            <ButtonWrapper>
              <Button
                content="Platite nalog"
                variant="primary"
                onClick={() => setShowModal(true)}
                disabled={paymentData?.status === 'Plaćen'}
              />
            </ButtonWrapper>
          </Row>
          <Row>
            <Input
              {...register('description')}
              label="OPIS:"
              textarea
              placeholder="Unesite opis"
              disabled={paymentData?.status === 'Plaćen'}
            />
          </Row>
          <Row>
            <Input
              label="Iznos za placanje:"
              value={roundCurrency(paymentData?.amount)}
              error={errors.amount?.message}
              style={{width: '250px'}}
              disabled
            />
          </Row>
          <Table tableHeads={receivableTableHeads} data={paymentData?.items || []} />

          <Footer>
            <Button
              content="Odustani"
              variant="secondary"
              style={{width: 130}}
              onClick={() => navigate('/finance/liabilities-receivables/receivables')}
            />

            <Button
              content="Sačuvaj"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={paymentData?.status === 'Plaćen'}
            />
          </Footer>
        </ReceivableFormContainer>

        {showModal && <PayOrderModal onClose={() => setShowModal(prev => !prev)} open={showModal} />}
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ReceivableDetails;
