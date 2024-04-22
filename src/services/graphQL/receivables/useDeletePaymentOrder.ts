import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ReceivablesResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';

const useDeletePaymentOrder = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deletePaymentOrder = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: ReceivablesResponse['delete'] = await fetch(GraphQL.deletePaymentOrder, {id});
    if (response.paymentOrder_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deletePaymentOrder};
};

export default useDeletePaymentOrder;
