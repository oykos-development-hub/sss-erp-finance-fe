import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {
  DepositPaymentOrder,
  DepositPaymentOrderInsertData,
  DepositPaymentOrderResponse,
} from '../../../types/graphQL/depositPaymentOrders.ts';

const useInsertDepositPaymentOrder = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertDepositPaymentOrder = async (
    data: DepositPaymentOrderInsertData,
    onSuccess?: (item: DepositPaymentOrder) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: DepositPaymentOrderResponse['insert'] = await fetch(GraphQL.insertDepositPaymentOrder, {data});
    if (response?.depositPaymentOrder_Insert?.status === 'success') {
      onSuccess && onSuccess(response.depositPaymentOrder_Insert.item);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertDepositPaymentOrder};
};

export default useInsertDepositPaymentOrder;
