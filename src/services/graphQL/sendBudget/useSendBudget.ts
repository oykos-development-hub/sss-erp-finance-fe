import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {BudgetResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';

const useSendBudget = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const sendBudget = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: BudgetResponse['send'] = await fetch(GraphQL.sendBudget, {id});
    if (response?.budget_Send?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, sendBudget};
};

export default useSendBudget;
