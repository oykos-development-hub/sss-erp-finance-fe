import {FlatRateResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';

const useDeleteFlatRate = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFlatRate = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: FlatRateResponse['delete'] = await fetch(GraphQL.deleteFlatRate, {id});
    if (response.flatRate_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFlatRate};
};

export default useDeleteFlatRate;
