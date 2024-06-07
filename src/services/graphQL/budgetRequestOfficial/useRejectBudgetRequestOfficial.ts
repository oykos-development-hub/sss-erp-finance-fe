import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {BudgetRequestOfficialResponse} from '../../../types/graphQL/response.ts';

const useRejectBudgetRequestOfficial = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const rejectBudgetRequestOfficial = async (
    request_id: number,
    comment: string,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (loading) return;
    setLoading(true);
    const response: BudgetRequestOfficialResponse['reject'] = await fetch(GraphQL.rejectBudgetRequestOfficial, {
      request_id,
      comment,
    });
    if (response?.budgetRequest_Reject?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, rejectBudgetRequestOfficial};
};

export default useRejectBudgetRequestOfficial;
