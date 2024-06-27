import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {NonFinancialResponse} from '../../../types/graphQL/response';
import {NonFinancialDetails} from '../../../types/graphQL/budgetRequestDetails.ts';

const useGetNonFinancialBudgetOverview = (
  year: number | null,
  onSuccess?: () => void,
  onError?: () => void,
  skip?: boolean,
) => {
  const [nonFinancialBudgets, setNonFinancialBudgets] = useState<NonFinancialDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchNonFinancialBudgetOverview = async () => {
    setLoading(true);
    const response: NonFinancialResponse['get'] = await fetch(GraphQL.nonFinancialBudgetOverview, {year});

    if (response.nonFinancialBudget_Overview.status === 'success') {
      setNonFinancialBudgets(response.nonFinancialBudget_Overview.items);
      setTotal(response.nonFinancialBudget_Overview.total || 0);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!skip) {
      fetchNonFinancialBudgetOverview();
    }
  }, [year]);

  return {nonFinancialBudgets, loading, refetch: fetchNonFinancialBudgetOverview, total};
};

export default useGetNonFinancialBudgetOverview;
