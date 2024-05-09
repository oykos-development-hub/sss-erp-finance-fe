import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {AccountingResponse} from '../../../types/graphQL/response.ts';

const useDeleteAccountingEntry = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteAccountingEntry = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: AccountingResponse['delete'] = await fetch(GraphQL.deleteAccountingEntry, {id});
    if (response.accountingEntry_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteAccountingEntry};
};

export default useDeleteAccountingEntry;
