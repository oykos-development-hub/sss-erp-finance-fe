import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FinesResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {FineForm} from '../../../types/graphQL/fineForm.ts';

const useInsertFine = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertFine = async (data: FineForm, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);
    const response: FinesResponse['insert'] = await fetch(GraphQL.insertFine, {data});
    if (response?.fine_Insert?.status === 'success') {
      onSuccess && onSuccess(response.fine_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertFine};
};

export default useInsertFine;
