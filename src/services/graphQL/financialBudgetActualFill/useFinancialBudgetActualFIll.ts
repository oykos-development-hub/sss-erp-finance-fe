import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {FinancialBudgetActualFillResponse} from '../../../types/graphQL/response.ts';

const useFinancialBudgetActualFill = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const financialBudgetActualFill = async (
    data: {data: any; request_id: number},
    onSuccess?: (item: any) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: FinancialBudgetActualFillResponse['fill'] = await fetch(GraphQL.financialBudgetActualFill, data);
    if (response?.financialBudgetActual_Fill?.status === 'success') {
      onSuccess && onSuccess(response.financialBudgetActual_Fill.items);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, financialBudgetActualFill};
};

export default useFinancialBudgetActualFill;
