import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {PaymentsResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';

const useDeletePayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deletePayment = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: PaymentsResponse['delete'] = await fetch(GraphQL.deletePayment, {id});
    if (response.finePayment_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deletePayment};
};

export default useDeletePayment;
