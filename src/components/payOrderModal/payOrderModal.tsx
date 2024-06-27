import {Datepicker, Input, Modal} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext.ts';
import usePayPaymentOrder from '../../services/graphQL/receivables/usePayPaymentOrder.ts';
import {parseDateForBackend} from '../../utils/dateUtils.ts';

interface FundReleaseModalProps {
  onClose: () => void;
  open: boolean;
  id?: number;
}

interface FundReleaseModalForm {
  date_of_sap: string;
  sap_id: string;
}

const initialValues = {
  date_of_sap: '',
  sap_id: '',
};

const PayOrderModal = ({onClose, open}: FundReleaseModalProps) => {
  const {
    formState: {errors},
    control,
    register,
    handleSubmit,
  } = useForm<FundReleaseModalForm>({defaultValues: initialValues});

  const {
    navigation: {navigate, location},
    alert,
  } = useAppContext();

  const {loading, payPaymentOrder} = usePayPaymentOrder();
  const receivableID = location.pathname.split('/').at(-1);

  const onSubmit = async (data: any) => {
    if (loading) return;

    const payload = {
      id: Number(receivableID),
      date_of_sap: parseDateForBackend(data?.date_of_sap),
      sap_id: data?.sap_id,
    };

    payPaymentOrder(
      payload,
      () => {
        alert.success('Uspješno plaćanje naloga.');
        navigate('/finance/liabilities-receivables/receivables');
      },
      message =>
        message ===
        'make api request: backend error: API error: 500 - upper tx: repo current budget update balance: insufficient funds'
          ? alert.error('Nemate dovoljno novca za plaćanje.')
          : alert.error('Neuspješno plaćanje naloga.'),
    );

    return;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="PLAĆANJE NALOGA"
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit(onSubmit)}
      rightButtonText="Platite nalog"
      leftButtonText="Otkaži"
      content={
        <div>
          <Input
            {...register('sap_id', {required: 'Ovo polje je obavezno.'})}
            label="SAP ID:"
            error={errors.sap_id?.message}
            style={{marginBottom: 10}}
            isRequired
          />
          <Controller
            name="date_of_sap"
            rules={{required: 'Ovo polje je obavezno.'}}
            control={control}
            render={({field: {name, value, onChange}}) => (
              <Datepicker
                name={name}
                selected={value ? new Date(value) : ''}
                label="SAP DATUM:"
                onChange={onChange}
                isRequired
                error={errors.date_of_sap?.message}
              />
            )}
          />
        </div>
      }
    />
  );
};

export default PayOrderModal;
