import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FixedDepositItemResponse} from '../../../types/graphQL/fixedDeposits.ts';
import {GraphQL} from '../index.ts';

const useDeleteFixedDepositItem = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFixedDepositItem = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FixedDepositItemResponse['delete'] = await fetch(GraphQL.deleteFixedDepositItem, {id});
    if (response.fixedDepositItem_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFixedDepositItem};
};

export default useDeleteFixedDepositItem;
