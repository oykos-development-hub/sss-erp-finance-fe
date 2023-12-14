import {useEffect, useState} from 'react';
import {BudgetDetailsParams} from '../../../types/graphQL/budgetDetails';
import {GraphQL} from '..';
import {BudgetResponse} from '../../../types/graphQL/response';
import {initialOverviewData} from '../../constants';
import useAppContext from '../../../context/useAppContext.ts';

const useGetBudgetDetails = ({id}: BudgetDetailsParams, onSuccess?: () => void, onError?: () => void) => {
  const [budgetDetails, setBudgetDetails] = useState<BudgetResponse['details']['budget_Details']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchBudgetDetails = async () => {
    setLoading(true);
    const response: BudgetResponse['details'] = await fetch(GraphQL.getBudgetDetails, id);

    if (response.budget_Details.status === 'success') {
      setBudgetDetails(response.budget_Details);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgetDetails();
  }, [id]);

  return {budgetDetails, loading, refetch: fetchBudgetDetails};
};

export default useGetBudgetDetails;
