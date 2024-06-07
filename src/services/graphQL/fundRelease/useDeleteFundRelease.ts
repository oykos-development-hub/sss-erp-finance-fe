import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';

const useDeleteFundRelease = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteFundRelease = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: any = await fetch(GraphQL.deleteFundRelease, {id});
    if (response.spendingRelease_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteFundRelease};
};

export default useDeleteFundRelease;
