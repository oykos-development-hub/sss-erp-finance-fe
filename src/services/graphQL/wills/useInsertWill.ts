import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InsertWillData, WillResponse} from '../../../types/graphQL/wills.ts';
import {GraphQL} from '../index.ts';

const useInsertWill = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertWill = async (data: InsertWillData, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);

    const response: WillResponse['insert'] = await fetch(GraphQL.insertWill, {data});
    if (response?.fixedDepositWill_Insert?.status === 'success') {
      onSuccess && onSuccess(response.fixedDepositWill_Insert.item.id);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertWill};
};

export default useInsertWill;
