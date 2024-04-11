import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FixedDepositStatus, FixedDepositType} from '../../../types/deposits.ts';
import {FixedDepositResponse} from '../../../types/graphQL/fixedDeposits.ts';
import {PageParams} from '../../../types/graphQL/response.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {initialOverviewData} from '../../constants.ts';
import {GraphQL} from '../index.ts';

type GetBudgetFinancialParams = {
  judge_id?: number | null;
  id?: number | null;
  status?: FixedDepositStatus;
  search?: string;
  organization_unit_id: number;
  type: FixedDepositType;
} & PageParams;

const useGetFixedDeposits = (
  {judge_id, id, status, search, organization_unit_id, page, size, type}: GetBudgetFinancialParams,
  opts?: QueryOptions<FixedDepositResponse['get']['fixedDeposit_Overview']>,
) => {
  const [fixedDeposits, setFixedDeposits] =
    useState<FixedDepositResponse['get']['fixedDeposit_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchFixedDeposits = async () => {
    setLoading(true);

    const response: FixedDepositResponse['get'] = await fetch(GraphQL.getFixedDeposits, {
      judge_id,
      id,
      status,
      search,
      organization_unit_id,
      page,
      size,
      type,
    });

    if (response.fixedDeposit_Overview.status === ResponseStatus.Success) {
      setFixedDeposits(response.fixedDeposit_Overview);

      if (opts?.onSuccess) opts.onSuccess();
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFixedDeposits();
  }, [judge_id, id, organization_unit_id, status, search, page, size, type]);

  return {data: fixedDeposits, loading, refetch: fetchFixedDeposits};
};

export default useGetFixedDeposits;
