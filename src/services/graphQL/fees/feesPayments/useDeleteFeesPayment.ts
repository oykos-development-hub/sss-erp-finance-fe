import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {FeesPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';

const useDeleteFeesPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFeePayment = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FeesPaymentsResponse['delete'] = await fetch(GraphQL.deleteFeePayment, {id});
    if (response.feePayment_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFeePayment};
};

export default useDeleteFeesPayment;
