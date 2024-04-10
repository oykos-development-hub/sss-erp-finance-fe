import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FlatRateResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {FlatRateForm} from '../../../types/graphQL/flatRate.ts';

const useInsertFlatRate = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const insertFlatRate = async (data: FlatRateForm, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);
    const response: FlatRateResponse['insert'] = await fetch(GraphQL.insertFlatRate, {data});
    if (response?.flatRate_Insert?.status === 'success') {
      onSuccess && onSuccess(response.flatRate_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertFlatRate};
};

export default useInsertFlatRate;
