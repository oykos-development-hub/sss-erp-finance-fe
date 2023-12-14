import {useEffect, useState} from 'react';
import {BudgetOverviewParams} from '../../../types/graphQL/budgetOverview';
import {GraphQL} from '..';
import {BudgetResponse} from '../../../types/graphQL/response';
import {initialOverviewData} from '../../constants';
import useAppContext from '../../../context/useAppContext.ts';

const useGetBudgets = (params: BudgetOverviewParams, onSuccess?: () => void, onError?: () => void) => {
  const [budgets, setBudgets] = useState<BudgetResponse['get']['budget_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();
  const fetchBudgetOverview = async () => {
    setLoading(true);
    const response: BudgetResponse['get'] = await fetch(GraphQL.getBudgets, params);

    if (response.budget_Overview.status === 'success') {
      setBudgets(response.budget_Overview);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBudgetOverview();
  }, [params.id, params.page, params.size, params.year, params.type_budget, params.status]);

  return {budgets, loading, refetch: fetchBudgetOverview};
};

export default useGetBudgets;
