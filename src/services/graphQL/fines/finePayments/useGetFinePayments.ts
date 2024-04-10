import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {GraphQL} from '../../index.ts';
import {FinesPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {PaymentDetails} from '../../../../screens/finesAndTaxes/fines/paymentDetails/types.ts';

const useGetFinePayments = (fine_id: number) => {
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchPayments = async () => {
    setLoading(true);
    const response: FinesPaymentsResponse['get'] = await fetch(GraphQL.getFinePayments, {fine_id});
    if (response.finePayment_Overview.status === 'success') {
      setPayments(response.finePayment_Overview.items);
      setTotal(response.finePayment_Overview.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [fine_id]);

  return {payments, loading, total, refetch: fetchPayments};
};

export default useGetFinePayments;
