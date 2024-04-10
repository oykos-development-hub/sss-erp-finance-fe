import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {GraphQL} from '../../index.ts';
import {FeesPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {PaymentDetails} from '../../../../screens/finesAndTaxes/taxes/paymentDetails/types.ts';

const useGetFeesPayments = (fee_id: number) => {
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchPayments = async () => {
    setLoading(true);
    const response: FeesPaymentsResponse['get'] = await fetch(GraphQL.getFeePayments, {fee_id});
    if (response?.feePayment_Overview?.status === 'success') {
      setPayments(response.feePayment_Overview.items);
      setTotal(response.feePayment_Overview.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [fee_id]);

  return {payments, loading, total, refetch: fetchPayments};
};

export default useGetFeesPayments;
