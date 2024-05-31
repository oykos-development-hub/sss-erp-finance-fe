import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';

const useCancelOrderPayments = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const cancelOrderPayments = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response = await fetch(GraphQL.cancelOrderPayment, {id});
    if (response.cancelPaymentOrder.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, cancelOrderPayments};
};

export default useCancelOrderPayments;
