import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {NonFinancialBudgetFillResponse} from '../../../types/graphQL/response.ts';

const useNonFinancialBudgetFill = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const nonFinancialBudgetFill = async (data: any, onSuccess?: (item: any) => void, onError?: () => void) => {
    setLoading(true);

    const response: NonFinancialBudgetFillResponse['fill'] = await fetch(GraphQL.nonFinancialBudgetFill, data);
    if (response?.nonFinancialBudget_Fill?.status === 'success') {
      onSuccess && onSuccess(response.nonFinancialBudget_Fill.items);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, nonFinancialBudgetFill};
};

export default useNonFinancialBudgetFill;
