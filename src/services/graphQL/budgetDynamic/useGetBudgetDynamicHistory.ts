import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  BudgetDynamicHistoryItem,
  GetBudgetDynamicHistoryResponse,
  GetBudgetDynamicParams,
} from '../../../types/graphQL/budgetDynamic';

const useGetBudgetDynamicHistory = ({budget_id, unit_id}: GetBudgetDynamicParams) => {
  const [budgetDynamicHistory, setBudgetDynamicHistory] = useState<BudgetDynamicHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchBudgetDynamicHistory = async () => {
    const response: GetBudgetDynamicHistoryResponse = await fetch(GraphQL.getBudgetDynamicHistory, {
      budget_id,
      unit_id,
    });
    const budgetDynamicHistory = response?.spendingDynamic_History.items;

    if (budgetDynamicHistory) setBudgetDynamicHistory(budgetDynamicHistory);
    setTotal(response?.spendingDynamic_History?.total || 0);

    setLoading(false);
  };

  useEffect(() => {
    fetchBudgetDynamicHistory();
  }, [budget_id, unit_id]);

  return {budgetDynamicHistory, total, loading, refetch: fetchBudgetDynamicHistory};
};

export default useGetBudgetDynamicHistory;
