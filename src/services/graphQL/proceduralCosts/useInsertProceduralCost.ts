import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ProceduralCostResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {ProceduralCostsForm} from '../../../types/graphQL/proceduralCosts.ts';

const useInsertProceduralCost = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();
  const insertProceduralCost = async (
    data: ProceduralCostsForm,
    onSuccess: (id: number) => void,
    onError: () => void,
  ) => {
    setLoading(true);
    const response: ProceduralCostResponse['insert'] = await fetch(GraphQL.insertProceduralCost, {data});
    if (response?.procedureCost_Insert?.status === 'success') {
      onSuccess && onSuccess(response.procedureCost_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertProceduralCost};
};

export default useInsertProceduralCost;
