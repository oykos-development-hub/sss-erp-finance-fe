import {useState} from 'react';
import {GraphQL} from '..';
import {BudgetOverviewInsertData} from '../../../types/graphQL/budgetInsert';
import useAppContext from '../../../context/useAppContext.ts';
import {BudgetResponse} from '../../../types/graphQL/response.ts';

const useInsertBudget = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const insertBudget = async (data: BudgetOverviewInsertData, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: BudgetResponse['insert'] = await fetch(GraphQL.insertBudget, {data});
    if (response.budget_Insert.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertBudget};
};

export default useInsertBudget;
