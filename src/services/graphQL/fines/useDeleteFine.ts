import {FinesResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';

const useDeleteFine = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFine = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FinesResponse['delete'] = await fetch(GraphQL.deleteFine, {id});
    if (response.fine_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFine};
};

export default useDeleteFine;
