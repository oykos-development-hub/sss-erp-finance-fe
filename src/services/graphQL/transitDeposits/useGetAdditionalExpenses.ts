import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {AdditionalExpensesResponse} from '../../../types/graphQL/depositPaymentOrders.ts';
import {PageParams} from '../../../types/graphQL/response.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {initialOverviewData} from '../../constants.ts';
import {GraphQL} from '../index.ts';

type GetAdditionalExpensesParams = {
  id?: number | null;
  year?: number;
  subject_id?: string;
  status?: string;
  search?: string;
  organization_unit_id: number;
} & PageParams;

const useGetAdditionalExpenses = (
  {id, status, search, organization_unit_id, page, size}: GetAdditionalExpensesParams,
  opts?: QueryOptions<AdditionalExpensesResponse['get']['depositPaymentOrder_Overview']>,
) => {
  const [additionalExpenses, setAdditionalExpenses] =
    useState<AdditionalExpensesResponse['get']['depositPaymentOrder_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchAdditionalExpenses = async () => {
    setLoading(true);

    const response: AdditionalExpensesResponse['get'] = await fetch(GraphQL.getAdditionalExpenses, {
      id,
      status,
      search,
      organization_unit_id,
      page,
      size,
    });

    if (response.depositPaymentOrder_Overview.status === ResponseStatus.Success) {
      setAdditionalExpenses(response.depositPaymentOrder_Overview);

      if (opts?.onSuccess) opts.onSuccess();
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAdditionalExpenses();
  }, [id, organization_unit_id, status, search, page, size]);

  return {data: additionalExpenses, loading, refetch: fetchAdditionalExpenses};
};

export default useGetAdditionalExpenses;
