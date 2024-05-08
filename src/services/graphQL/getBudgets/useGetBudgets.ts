import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {BudgetListParams, BudgetOverviewItem} from '../../../types/graphQL/budgetOverview';
import {BudgetResponse} from '../../../types/graphQL/response';

const useGetBudgets = (params: BudgetListParams, onSuccess?: () => void, onError?: () => void, skip?: boolean) => {
  const [budgets, setBudgets] = useState<BudgetOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchBudgetOverview = async () => {
    setLoading(true);
    const response: BudgetResponse['get'] = await fetch(GraphQL.getBudgets, params);

    if (response.budget_Overview.status === 'success') {
      setBudgets(response.budget_Overview.items);
      setTotal(response.budget_Overview.total || 0);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!skip) {
      fetchBudgetOverview();
    }
  }, [params.id, params.page, params.size, params.year, params.budget_type, params.status]);

  return {budgets, loading, refetch: fetchBudgetOverview, total};
};

export default useGetBudgets;
