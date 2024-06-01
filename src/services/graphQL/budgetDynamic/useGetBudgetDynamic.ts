import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';

import {
  BudgetDynamicCount,
  GetBudgetDynamicParams,
  GetBudgetDynamicResponse,
} from '../../../types/graphQL/budgetDynamic';

const useGetBudgetDynamic = ({budget_id, unit_id, version}: GetBudgetDynamicParams) => {
  const [budgetDynamic, setBudgetDynamic] = useState<BudgetDynamicCount[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchBudgetDynamic = async () => {
    const response: GetBudgetDynamicResponse = await fetch(GraphQL.getBudgetDynamic, {
      budget_id,
      unit_id,
      version,
    });
    const budgetDynamic = response?.spendingDynamic_Overview.items;

    if (budgetDynamic) setBudgetDynamic(budgetDynamic);

    setLoading(false);
  };

  useEffect(() => {
    fetchBudgetDynamic();
  }, [budget_id, unit_id, version]);

  return {budgetDynamic, loading, refetch: fetchBudgetDynamic};
};

export default useGetBudgetDynamic;
