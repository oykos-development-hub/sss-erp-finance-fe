import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {FixedDeposit, FixedDepositInsertData, FixedDepositResponse} from '../../../types/graphQL/fixedDeposits.ts';

const useInsertFixedDeposit = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertFixedDeposit = async (
    data: FixedDepositInsertData,
    onSuccess?: (item: FixedDeposit) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: FixedDepositResponse['insert'] = await fetch(GraphQL.insertFixedDeposit, {data});
    if (response?.fixedDeposit_Insert?.status === 'success') {
      onSuccess && onSuccess(response.fixedDeposit_Insert.item);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertFixedDeposit};
};

export default useInsertFixedDeposit;
