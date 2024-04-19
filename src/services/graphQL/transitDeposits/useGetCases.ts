import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {CaseListResponse, DepositPaymentOrderCase} from '../../../types/graphQL/depositPaymentOrders.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {GraphQL} from '../index.ts';

type GetCasesParams = {
  organization_unit_id: number;
  bank_account: string;
};

const useGetCases = (
  {organization_unit_id, bank_account}: GetCasesParams,
  opts?: QueryOptions<DepositPaymentOrderCase[]>,
) => {
  const [cases, setCases] = useState<DepositPaymentOrderCase[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchCases = async () => {
    setLoading(true);

    const response: CaseListResponse = await fetch(GraphQL.getCases, {
      organization_unit_id,
      bank_account,
    });

    if (response.depositCaseNumbers_Overview.status === ResponseStatus.Success) {
      setCases(response.depositCaseNumbers_Overview.items);

      if (opts?.onSuccess) opts.onSuccess();
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (organization_unit_id && bank_account) fetchCases();
  }, [organization_unit_id, bank_account]);

  return {data: opts?.transform ? opts.transform(cases) : cases, loading, refetch: fetchCases};
};

export default useGetCases;
