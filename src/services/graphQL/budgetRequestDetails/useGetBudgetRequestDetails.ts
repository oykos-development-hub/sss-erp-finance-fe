import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '..';
import {BudgetRequestItem} from '../../../types/graphQL/budgetRequestDetails.ts';
import {BudgetRequestDetails} from '../../../types/graphQL/response.ts';

type BudgetRequestDetailsParams = {
  budgetId: number;
  organizationUnitId: number;
};

const useGetBudgetRequestDetails = ({budgetId, organizationUnitId}: BudgetRequestDetailsParams) => {
  const [budgetRequestDetails, setBudgetRequestDetails] = useState<BudgetRequestItem>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const getBudgetRequestDetails = async () => {
    const response: BudgetRequestDetails['get'] = await fetch(GraphQL.getBudgetRequestDetails, {
      budget_id: budgetId,
      unit_id: organizationUnitId,
    });
    const data = response?.budgetRequests_Details;

    if (data?.item) setBudgetRequestDetails(data.item);

    setLoading(false);
  };

  useEffect(() => {
    getBudgetRequestDetails();
  }, [budgetId, organizationUnitId]);

  return {budgetRequestDetails, loading, getBudgetRequestDetails};
};

export default useGetBudgetRequestDetails;
