import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Input, Modal} from 'client-library';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {requiredError} from '../../../../constants';
import useAppContext from '../../../../context/useAppContext';
import usePayOrder from '../../../../services/graphQL/transitDeposits/usePayOrder';
import {FlexColumn} from '../../../../shared/flex';
import {parseDateForBackend} from '../../../../utils/dateUtils';

type PayOrderModalProps = {
  id: number;
  isOpen: boolean;
  onClose: () => void;
};

const payOrderSchema = yup.object().shape({
  id_of_statement: yup.string().required(requiredError),
  date_of_statement: yup.date().required(requiredError),
});

type PayOrderForm = yup.InferType<typeof payOrderSchema>;

const PayOrderModal = ({id, isOpen, onClose}: PayOrderModalProps) => {
  const {
    alert,
    navigation: {navigate},
  } = useAppContext();

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<PayOrderForm>({resolver: yupResolver(payOrderSchema)});

  const {payOrder} = usePayOrder();

  const onPayOrder = async (data: PayOrderForm) => {
    const payload = {
      id,
      id_of_statement: data.id_of_statement,
      date_of_statement: parseDateForBackend(data.date_of_statement) as string,
    };

    await payOrder(
      payload,
      () => {
        alert.success('Nalog je uspješno plaćen.');
        navigate('/finance/deposit/transit/payment-orders/overview');
        onClose();
      },
      () => {
        alert.error('Došlo je do greške prilikom plaćanja naloga.');
      },
    );
  };

  return (
    <Modal
      title="PLATI NALOG"
      open={isOpen}
      onClose={onClose}
      rightButtonOnClick={handleSubmit(onPayOrder)}
      leftButtonText="Odustani"
      rightButtonText="Sačuvaj"
      content={
        <FlexColumn gap={20}>
          <Input label="ID IZVODA:" {...register('id_of_statement')} error={errors.id_of_statement?.message} />
          <div style={{width: '100%'}}>
            <Controller
              name="date_of_statement"
              control={control}
              render={({field: {name, onChange, value}}) => (
                <Datepicker
                  name={name}
                  selected={value ? new Date(value) : null}
                  onChange={onChange}
                  label="DATUM NALOGA:"
                  error={errors.date_of_statement?.message}
                />
              )}
            />
          </div>
        </FlexColumn>
      }
    />
  );
};

export default PayOrderModal;
