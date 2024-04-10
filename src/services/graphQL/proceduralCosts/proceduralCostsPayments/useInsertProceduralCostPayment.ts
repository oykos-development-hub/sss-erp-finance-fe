import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {ProceduralCostPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';
import {ProceduralCostPaymentForm} from '../../../../types/graphQL/proceduralCosts.ts';

const useInsertProceduralCostPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertProceduralCostPayment = async (
    data: ProceduralCostPaymentForm,
    onSuccess: (id: number) => void,
    onError: () => void,
  ) => {
    setLoading(true);
    const response: ProceduralCostPaymentsResponse['insert'] = await fetch(GraphQL.insertProceduralCostPayment, {data});
    if (response?.procedureCostPayment_Insert?.status === 'success') {
      onSuccess && onSuccess(response.procedureCostPayment_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertProceduralCostPayment};
};

export default useInsertProceduralCostPayment;
