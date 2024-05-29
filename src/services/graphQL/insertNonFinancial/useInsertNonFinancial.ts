import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {NonFinancialResponse} from '../../../types/graphQL/response.ts';

const useInsertNonFinancial = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertNonFinancial = async (data: any, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: NonFinancialResponse['insert'] = await fetch(GraphQL.insertNonFinancial, {data});
    if (response.requestNotFinancially_Insert.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertNonFinancial};
};

export default useInsertNonFinancial;
