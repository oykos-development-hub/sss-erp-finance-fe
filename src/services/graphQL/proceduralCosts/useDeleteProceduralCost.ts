import {ProceduralCostResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';

const useDeleteProceduralCost = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteProceduralCost = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: ProceduralCostResponse['delete'] = await fetch(GraphQL.deleteProceduralCost, {id});
    if (response.procedureCost_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteProceduralCost};
};

export default useDeleteProceduralCost;
