import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';

const useCreateByOUFundRelease = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const createByOUFundRelease = async (file_id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: any = await fetch(GraphQL.createByOUFundRelease, {file_id});
    if (response.spendingReleaseRequest_Insert.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, createByOUFundRelease};
};

export default useCreateByOUFundRelease;
