import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {PayOrderData} from '../../../types/graphQL/depositPaymentOrders.ts';
import {SimpleResponse} from '../../../types/graphQL/response.ts';

const usePayOrder = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const payOrder = async (data: PayOrderData, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: {payDepositPaymentOrder: SimpleResponse} = await fetch(GraphQL.payOrder, data);
    if (response?.payDepositPaymentOrder?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, payOrder};
};

export default usePayOrder;
