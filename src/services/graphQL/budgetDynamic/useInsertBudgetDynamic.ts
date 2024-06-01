import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {BudgetDynamicInsertData, InsertBudgetDynamicResponse} from '../../../types/graphQL/budgetDynamic.ts';

const useInsertBudgetDynamic = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertBudgetDynamic = async (data: BudgetDynamicInsertData, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: InsertBudgetDynamicResponse = await fetch(GraphQL.insertBudgetDynamic, {data});

    if (response?.spendingDynamic_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertBudgetDynamic};
};

export default useInsertBudgetDynamic;
