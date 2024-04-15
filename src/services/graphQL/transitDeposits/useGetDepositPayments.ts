import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FixedDepositStatus} from '../../../types/deposits.ts';
import {PageParams} from '../../../types/graphQL/response.ts';
import {DepositPaymentResponse} from '../../../types/graphQL/depositPayments.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {initialOverviewData} from '../../constants.ts';
import {GraphQL} from '../index.ts';

type GetDepositPaymentsParams = {
  id?: number | null;
  status?: FixedDepositStatus;
  search?: string;
  organization_unit_id?: number;
} & PageParams;

const useGetDepositPayments = (
  {id, status, search, organization_unit_id, page, size}: GetDepositPaymentsParams,
  opts?: QueryOptions<DepositPaymentResponse['get']['depositPayment_Overview']>,
) => {
  const [depositPayments, setDepositPayments] =
    useState<DepositPaymentResponse['get']['depositPayment_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchDepositPayments = async () => {
    setLoading(true);

    const response: DepositPaymentResponse['get'] = await fetch(GraphQL.getDepositPayments, {
      id,
      status,
      search,
      organization_unit_id,
      page,
      size,
    });

    if (response.depositPayment_Overview.status === ResponseStatus.Success) {
      setDepositPayments(response.depositPayment_Overview);

      if (opts?.onSuccess) opts.onSuccess();
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDepositPayments();
  }, [id, organization_unit_id, status, search, page, size]);

  return {data: depositPayments, loading, refetch: fetchDepositPayments};
};

export default useGetDepositPayments;
