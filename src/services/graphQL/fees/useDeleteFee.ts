import {GraphQL} from '../index.ts';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FeesResponse} from '../../../types/graphQL/fees.ts';

const useDeleteFee = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFee = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FeesResponse['delete'] = await fetch(GraphQL.deleteFee, {id});
    if (response.fee_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFee};
};

export default useDeleteFee;
