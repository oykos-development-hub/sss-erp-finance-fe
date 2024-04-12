import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {WillDispatchResponse} from '../../../types/graphQL/wills.ts';
import {GraphQL} from '../index.ts';

const useDeleteWillDispatch = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteWillDispatch = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: WillDispatchResponse['delete'] = await fetch(GraphQL.deleteWillDispatch, {id});
    if (response.fixedDepositWillDispatch_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteWillDispatch};
};

export default useDeleteWillDispatch;
