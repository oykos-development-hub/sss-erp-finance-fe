import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ReceivablesResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {PayPaymentOrderParams} from '../../../types/graphQL/receivablesTypes.ts';

const usePayPaymentOrder = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const payPaymentOrder = async (data: PayPaymentOrderParams, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: ReceivablesResponse['pay'] = await fetch(GraphQL.payPaymentOrder, data);
    if (response.payPaymentOrder.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, payPaymentOrder};
};

export default usePayPaymentOrder;
