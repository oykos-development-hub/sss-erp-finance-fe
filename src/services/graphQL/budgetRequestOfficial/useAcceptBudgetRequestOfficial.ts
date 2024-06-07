import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {BudgetRequestOfficialResponse} from '../../../types/graphQL/response.ts';

const useAcceptBudgetRequestOfficial = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const acceptBudgetRequestOfficial = async (request_id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: BudgetRequestOfficialResponse['accept'] = await fetch(GraphQL.acceptBudgetRequestOfficial, {
      request_id,
    });
    if (response?.budgetRequest_Accept?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, acceptBudgetRequestOfficial};
};

export default useAcceptBudgetRequestOfficial;
