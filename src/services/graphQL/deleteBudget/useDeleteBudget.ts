import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {BudgetResponse} from '../../../types/graphQL/response.ts';

const useDeleteBudget = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteBudget = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: BudgetResponse['delete'] = await fetch(GraphQL.deleteBudget, {id});
    if (response.budget_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteBudget};
};

export default useDeleteBudget;
