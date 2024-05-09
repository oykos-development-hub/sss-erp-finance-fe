import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {AccountingInsertParams} from '../../../types/graphQL/accountingTypes.ts';
import {AccountingResponse} from '../../../types/graphQL/response.ts';

const useAccountingEntryInsert = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const accountingEntryInsert = async (data: AccountingInsertParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: AccountingResponse['insert'] = await fetch(GraphQL.accountingEntryInsert, {data});

    if (response?.accountingEntry_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, accountingEntryInsert};
};

export default useAccountingEntryInsert;
