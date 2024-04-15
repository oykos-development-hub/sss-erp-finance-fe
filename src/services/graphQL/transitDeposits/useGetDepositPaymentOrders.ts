import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FixedDepositStatus} from '../../../types/deposits.ts';
import {DepositPaymentOrderResponse} from '../../../types/graphQL/depositPaymentOrders.ts';
import {PageParams} from '../../../types/graphQL/response.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {initialOverviewData} from '../../constants.ts';
import {GraphQL} from '../index.ts';

type GetDepositPaymentOrdersParams = {
  id?: number | null;
  status?: FixedDepositStatus;
  search?: string;
  organization_unit_id: number;
} & PageParams;

const useGetDepositPaymentOrders = (
  {id, status, search, organization_unit_id, page, size}: GetDepositPaymentOrdersParams,
  opts?: QueryOptions<DepositPaymentOrderResponse['get']['depositPaymentOrder_Overview']>,
) => {
  const [paymentOrders, setPaymentOrders] =
    useState<DepositPaymentOrderResponse['get']['depositPaymentOrder_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchDepositPayments = async () => {
    setLoading(true);

    const response: DepositPaymentOrderResponse['get'] = await fetch(GraphQL.getDepositPayments, {
      id,
      status,
      search,
      organization_unit_id,
      page,
      size,
    });

    if (response.depositPaymentOrder_Overview.status === ResponseStatus.Success) {
      setPaymentOrders(response.depositPaymentOrder_Overview);

      if (opts?.onSuccess) opts.onSuccess();
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDepositPayments();
  }, [id, organization_unit_id, status, search, page, size]);

  return {data: paymentOrders, loading, refetch: fetchDepositPayments};
};

export default useGetDepositPaymentOrders;
