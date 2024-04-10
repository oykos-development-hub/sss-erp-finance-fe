import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {FinesPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';

const useDeleteFinePayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFinePayment = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FinesPaymentsResponse['delete'] = await fetch(GraphQL.deleteFinePayment, {id});
    if (response.finePayment_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFinePayment};
};

export default useDeleteFinePayment;
