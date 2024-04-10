import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {ProceduralCostPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';

const useDeleteProceduralCostPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteProceduralCostPayment = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: ProceduralCostPaymentsResponse['delete'] = await fetch(GraphQL.deleteProceduralCostPayment, {id});
    if (response.procedureCostPayment_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteProceduralCostPayment};
};

export default useDeleteProceduralCostPayment;
