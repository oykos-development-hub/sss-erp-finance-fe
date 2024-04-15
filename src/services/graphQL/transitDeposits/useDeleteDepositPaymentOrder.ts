import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {DepositPaymentOrderResponse} from '../../../types/graphQL/depositPaymentOrders.ts';
import {GraphQL} from '../index.ts';

const useDeleteDepositPaymentOrder = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteDepositPaymentOrder = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: DepositPaymentOrderResponse['delete'] = await fetch(GraphQL.deleteDepositPaymentOrder, {id});
    if (response.depositPaymentOrder_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteDepositPaymentOrder};
};

export default useDeleteDepositPaymentOrder;
