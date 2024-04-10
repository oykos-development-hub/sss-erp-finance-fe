import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {FlatRatePaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';

const useDeleteFlatRatePayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFlatRatePayment = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FlatRatePaymentsResponse['delete'] = await fetch(GraphQL.deleteFlatRatePayment, {id});
    if (response.flatRatePayment_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFlatRatePayment};
};

export default useDeleteFlatRatePayment;
