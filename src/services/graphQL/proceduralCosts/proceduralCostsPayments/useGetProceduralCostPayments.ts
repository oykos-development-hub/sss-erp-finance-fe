import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {GraphQL} from '../../index.ts';
import {ProceduralCostPaymentsResponse} from '../../../../types/graphQL/response.ts';

const useGetProceduralCostPayments = (procedure_cost_id: number) => {
  // TODO add type
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchPayments = async () => {
    setLoading(true);
    const response: ProceduralCostPaymentsResponse['get'] = await fetch(GraphQL.getProceduralCostPayments, {
      procedure_cost_id,
    });
    if (response.procedureCostPayment_Overview.status === 'success') {
      setPayments(response.procedureCostPayment_Overview.items);
      setTotal(response.procedureCostPayment_Overview.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [procedure_cost_id]);

  return {payments, loading, total, refetch: fetchPayments};
};

export default useGetProceduralCostPayments;
