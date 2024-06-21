import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {CurrentBudgetResponse} from '../../../types/graphQL/response.ts';

const useGetCurrentBudgetID = (
  {organization_unit_id}: {organization_unit_id: number},
  onSuccess?: () => void,
  onError?: () => void,
) => {
  const [loading, setLoading] = useState(true);
  const [budget_id, setBudget_id] = useState<number>(0);
  const [version, setVersion] = useState<number>(0);

  const {fetch} = useAppContext();

  const fetchCurrentBudgetID = async () => {
    setLoading(true);
    const response: CurrentBudgetResponse['get'] = await fetch(GraphQL.getCurrentBudgetID, {organization_unit_id});

    if (response.currentBudget_Overview.status === 'success') {
      setBudget_id(response?.currentBudget_Overview?.items?.budget_id);
      setVersion(response?.currentBudget_Overview?.items?.version);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurrentBudgetID();
  }, [organization_unit_id]);

  return {loading, refetch: fetchCurrentBudgetID, budget_id, version};
};

export default useGetCurrentBudgetID;
