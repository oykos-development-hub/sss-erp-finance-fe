import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FixedDepositResponse} from '../../../types/graphQL/fixedDeposits.ts';
import {GraphQL} from '../index.ts';

const useDeleteFixedDeposit = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFixedDeposit = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FixedDepositResponse['delete'] = await fetch(GraphQL.deleteFixedDeposit, {id});
    if (response.fixedDeposit_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFixedDeposit};
};

export default useDeleteFixedDeposit;
