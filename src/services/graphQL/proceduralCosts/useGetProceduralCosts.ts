import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {ProceduralCostResponse} from '../../../types/graphQL/response';
import {ProceduralCostOverviewItem, ProceduralCostParams} from '../../../types/graphQL/proceduralCosts.ts';

const useGetProceduralCosts = (params: ProceduralCostParams) => {
  const [proceduralCosts, setProceduralCosts] = useState<ProceduralCostOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchProceduralCostsOverview = async () => {
    setLoading(true);
    const response: ProceduralCostResponse['get'] = await fetch(GraphQL.proceduralCostsOverview, params);

    if (response.procedureCost_Overview.status === 'success') {
      setProceduralCosts(response.procedureCost_Overview.items);
      setTotal(response.procedureCost_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProceduralCostsOverview();
  }, [params.id, params.page, params.size, params.search, params.subject, params.procedure_cost_type_id]);

  return {proceduralCosts, loading, total, refetch: fetchProceduralCostsOverview};
};

export default useGetProceduralCosts;
