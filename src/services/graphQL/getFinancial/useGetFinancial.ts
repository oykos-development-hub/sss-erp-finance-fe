import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {BudgetFinancialResponse, BudgetFinancialResponseData} from '../../../types/graphQL/budgetFinancial.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {initialDetailsData} from '../../constants';
import getFinancialQuery from './getFinancial.ts';

type GetBudgetFinancialParams = {
  budget_id: number;
};

const useGetBudgetFinancial = (
  {budget_id}: GetBudgetFinancialParams,
  opts?: QueryOptions<BudgetFinancialResponseData>,
) => {
  const [budgetFinancial, setBudgetFinancial] = useState<BudgetFinancialResponseData>(initialDetailsData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchBudgetFinancial = async () => {
    setLoading(true);

    const response: BudgetFinancialResponse = await fetch(getFinancialQuery, {budget_id});

    if (response.financialBudget_Details.status === ResponseStatus.Success) {
      setBudgetFinancial(response.financialBudget_Details);

      if (opts?.onSuccess) opts.onSuccess();
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBudgetFinancial();
  }, [budget_id]);

  return {budgetFinancial, loading, refetch: fetchBudgetFinancial};
};

export default useGetBudgetFinancial;
