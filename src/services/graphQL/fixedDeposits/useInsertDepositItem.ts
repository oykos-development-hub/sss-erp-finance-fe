import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {FixedDepositItemInsertData, FixedDepositItemResponse} from '../../../types/graphQL/fixedDeposits.ts';

//* This hook is used to insert a new fixed deposit item (first table in the deposit details page)

const useInsertFixedDepositItem = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertFixedDepositItem = async (
    data: FixedDepositItemInsertData,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: FixedDepositItemResponse['insert'] = await fetch(GraphQL.insertFixedDepositItem, {data});
    if (response?.fixedDepositItem_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertFixedDepositItem};
};

export default useInsertFixedDepositItem;
