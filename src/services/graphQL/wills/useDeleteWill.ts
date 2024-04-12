import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {WillResponse} from '../../../types/graphQL/wills.ts';
import {GraphQL} from '../index.ts';

const useDeleteWill = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteWill = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: WillResponse['delete'] = await fetch(GraphQL.deleteWill, {id});
    if (response.fixedDepositWill_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteWill};
};

export default useDeleteWill;
