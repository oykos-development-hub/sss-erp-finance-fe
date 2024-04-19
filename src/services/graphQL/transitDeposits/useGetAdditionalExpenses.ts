import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {
  AdditionalExpensesResponse,
  PaymentOrderAdditionalExpense,
} from '../../../types/graphQL/depositPaymentOrders.ts';
import {PageParams} from '../../../types/graphQL/response.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {initialOverviewData} from '../../constants.ts';
import {GraphQL} from '../index.ts';

type GetAdditionalExpensesParams = {
  id?: number | null;
  year?: number;
  subject_id?: number;
  status?: string;
  search?: string;
  organization_unit_id: number;
  source_bank_account?: string;
} & PageParams;

const useGetAdditionalExpenses = (
  {id, status, search, organization_unit_id, source_bank_account, page, size}: GetAdditionalExpensesParams,
  opts?: QueryOptions<PaymentOrderAdditionalExpense[]>,
) => {
  const [additionalExpenses, setAdditionalExpenses] =
    useState<AdditionalExpensesResponse['get']['depositPaymentAdditionalExpenses_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchAdditionalExpenses = async () => {
    setLoading(true);

    const response: AdditionalExpensesResponse['get'] = await fetch(GraphQL.getAdditionalExpenses, {
      id,
      status,
      search,
      organization_unit_id,
      source_bank_account,
      page,
      size,
    });

    if (response.depositPaymentAdditionalExpenses_Overview.status === ResponseStatus.Success) {
      setAdditionalExpenses(response.depositPaymentAdditionalExpenses_Overview);

      if (opts?.onSuccess) opts.onSuccess(response.depositPaymentAdditionalExpenses_Overview.items);
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  return {data: additionalExpenses, loading, fetchAdditionalExpenses};
};

export default useGetAdditionalExpenses;
