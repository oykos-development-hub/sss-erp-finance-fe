import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InsertFundReleaseData, InsertFundReleaseResponse} from '../../../types/graphQL/fundRelease.ts';
import {GraphQL} from '../index.ts';

const useInsertFundRelease = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertFundRelease = async (data: InsertFundReleaseData, onSuccess: () => void, onError: () => void) => {
    setLoading(true);
    const response: InsertFundReleaseResponse = await fetch(GraphQL.insertFundRelease, {data});
    if (response?.spendingRelease_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertFundRelease};
};

export default useInsertFundRelease;
