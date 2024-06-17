import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {CurrentBudgetResponse} from '../../../types/graphQL/response.ts';

const useGetCurrentBudget = (
  {organization_unit_id}: {organization_unit_id: number},
  onSuccess?: () => void,
  onError?: () => void,
) => {
  const [currentBudget, setCurrentBudget] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<number>(0);
  const [budget_id, setBudget_id] = useState<number>(0);

  const {fetch} = useAppContext();

  const fetchCurrentBudget = async () => {
    setLoading(true);
    const response: CurrentBudgetResponse['get'] = await fetch(GraphQL.getCurrentBudget, {organization_unit_id});

    if (response.currentBudget_Overview.status === 'success') {
      setCurrentBudget(response?.currentBudget_Overview?.items?.current_accounts);
      setVersion(response?.currentBudget_Overview?.items?.version);
      setBudget_id(response?.currentBudget_Overview?.items?.budget_id);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurrentBudget();
  }, [organization_unit_id]);

  return {currentBudget, loading, refetch: fetchCurrentBudget, version, budget_id};
};

export default useGetCurrentBudget;
