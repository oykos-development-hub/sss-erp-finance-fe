import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {GraphQL} from '../../index.ts';
import {FlatRatePaymentsResponse} from '../../../../types/graphQL/response.ts';
import {PaymentDetails} from '../../../../screens/finesAndTaxes/flatRate/paymentDetails/types.ts';

const useGetFlatRatePayments = (flat_rate_id: number) => {
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchPayments = async () => {
    setLoading(true);
    const response: FlatRatePaymentsResponse['get'] = await fetch(GraphQL.getFlatRatePayments, {
      flat_rate_id,
    });
    if (response.flatRatePayment_Overview.status === 'success') {
      setPayments(response.flatRatePayment_Overview.items);
      setTotal(response.flatRatePayment_Overview.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [flat_rate_id]);

  return {payments, loading, total, refetch: fetchPayments};
};

export default useGetFlatRatePayments;
