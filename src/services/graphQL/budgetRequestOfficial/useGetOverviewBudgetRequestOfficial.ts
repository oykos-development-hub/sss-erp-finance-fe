import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {BudgetRequestOverview} from '../../../types/graphQL/response.ts';

interface OverviewBudgetRequestOfficialParams {
  budget_id: number;
}

const useGetOverviewBudgetRequestOfficial = (
  params: OverviewBudgetRequestOfficialParams,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchOverviewBudgetRequestOfficial = async () => {
    setLoading(true);
    const response: BudgetRequestOverview['get'] = await fetch(GraphQL.getOverviewBudgetRequestOfficial, params);

    if (response.officialBudgetRequests_Overview.status === 'success') {
      setRequests(response.officialBudgetRequests_Overview.items);
      setTotal(response.officialBudgetRequests_Overview.total || 0);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOverviewBudgetRequestOfficial();
  }, [params.budget_id]);

  return {requests, loading, refetch: fetchOverviewBudgetRequestOfficial, total};
};

export default useGetOverviewBudgetRequestOfficial;
