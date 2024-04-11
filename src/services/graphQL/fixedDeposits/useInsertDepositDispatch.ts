import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {
  DepositDispatch,
  FixedDepositDispatchData,
  FixedDepositDispatchResponse,
} from '../../../types/graphQL/fixedDeposits.ts';

const useInsertDepositDispatch = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertDepositDispatch = async (
    data: FixedDepositDispatchData,
    onSuccess?: (item: DepositDispatch) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: FixedDepositDispatchResponse['insert'] = await fetch(GraphQL.insertDepositDispatch, {data});
    if (response?.fixedDepositDispatch_Insert?.status === 'success') {
      onSuccess && onSuccess(response.fixedDepositDispatch_Insert.item);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertDepositDispatch};
};

export default useInsertDepositDispatch;
