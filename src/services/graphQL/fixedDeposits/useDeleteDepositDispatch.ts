import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FixedDepositDispatchResponse} from '../../../types/graphQL/fixedDeposits.ts';
import {GraphQL} from '../index.ts';

const useDeleteDepositDispatch = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteDepositDispatch = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FixedDepositDispatchResponse['delete'] = await fetch(GraphQL.deleteDepositDispatch, {id});
    if (response.fixedDepositDispatch_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteDepositDispatch};
};

export default useDeleteDepositDispatch;
