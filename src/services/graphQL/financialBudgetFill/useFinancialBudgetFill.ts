import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {FinancialBudgetFillResponse} from '../../../types/graphQL/response.ts';

const useFinancialBudgetFill = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const financialBudgetFill = async (
    data: {data: any; request_id: number; comment: string},
    onSuccess?: (item: any) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: FinancialBudgetFillResponse['fill'] = await fetch(GraphQL.financialBudgetFill, {
      request_id: data.request_id,
      comment: data.comment,
      data: data.data,
    });
    if (response?.financialBudget_Fill?.status === 'success') {
      onSuccess && onSuccess(response.financialBudget_Fill.items);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, financialBudgetFill};
};

export default useFinancialBudgetFill;
