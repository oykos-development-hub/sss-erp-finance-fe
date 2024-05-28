import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {BudgetResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';

const useSendBudgetOnReview = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const sendBudgetOnReview = async (request_id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: BudgetResponse['sendOnReview'] = await fetch(GraphQL.sendBudgetOnReview, {request_id});
    if (response?.budget_SendOnReview?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, sendBudgetOnReview};
};

export default useSendBudgetOnReview;
