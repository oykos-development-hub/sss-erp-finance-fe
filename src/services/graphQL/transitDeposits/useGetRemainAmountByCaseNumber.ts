import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {RemainAmountByCaseNumberResponse} from '../../../types/graphQL/depositPaymentOrders.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {initialOverviewData} from '../../constants.ts';
import {GraphQL} from '../index.ts';

const useGetRemainAmountByCaseNumber = (
  case_number: string,
  opts?: QueryOptions<RemainAmountByCaseNumberResponse['get']['depositPaymentCaseNumber_Overview']>,
) => {
  const [remainAmount, setRemainAmount] =
    useState<RemainAmountByCaseNumberResponse['get']['depositPaymentCaseNumber_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchRemainAmount = async () => {
    setLoading(true);

    const response: RemainAmountByCaseNumberResponse['get'] = await fetch(GraphQL.getDepositPayments, {
      case_number,
    });

    if (response.depositPaymentCaseNumber_Overview.status === ResponseStatus.Success) {
      setRemainAmount(response.depositPaymentCaseNumber_Overview);

      if (opts?.onSuccess) opts.onSuccess();
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRemainAmount();
  }, [case_number]);

  return {data: remainAmount, loading, refetch: fetchRemainAmount};
};

export default useGetRemainAmountByCaseNumber;
