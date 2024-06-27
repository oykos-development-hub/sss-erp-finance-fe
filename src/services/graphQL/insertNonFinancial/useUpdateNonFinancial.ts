import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {NonFinancialResponse} from '../../../types/graphQL/response.ts';

const useUpdateNonFinancial = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const updateNonFinancial = async (data: any, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: NonFinancialResponse['update'] = await fetch(GraphQL.updateNonFinancial, {data});
    if (response.nonFinancialBudget_Update.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, updateNonFinancial};
};

export default useUpdateNonFinancial;
