import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InsertWillDispatchData, WillDispatchResponse} from '../../../types/graphQL/wills.ts';
import {GraphQL} from '../index.ts';

const useInsertWillDispatch = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertWillDispatch = async (data: InsertWillDispatchData, onSuccess: () => void, onError: () => void) => {
    setLoading(true);

    const response: WillDispatchResponse['insert'] = await fetch(GraphQL.insertWillDispatch, {data});
    if (response?.fixedDepositWillDispatch_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertWillDispatch};
};

export default useInsertWillDispatch;
