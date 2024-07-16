import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';

const useAcceptBySSSFundRelease = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const acceptBySSSFundRelease = async (file_id: number, id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: any = await fetch(GraphQL.acceptBySSSFundRelease, {file_id, id});
    if (response?.spendingReleaseAcceptSSS?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, acceptBySSSFundRelease};
};

export default useAcceptBySSSFundRelease;
