import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ExternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';
import {ExternalReallocationsOverviewParams, ReallocationItem} from '../../../types/graphQL/externalReallocations.ts';

const useGetExternalReallocations = (params: ExternalReallocationsOverviewParams) => {
  const [externalReallocations, setExternalReallocations] = useState<ReallocationItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchExternalReallocations = async () => {
    setLoading(true);
    const response: ExternalReallocationResponse['get'] = await fetch(GraphQL.getExternalReallocations, params);

    if (response.externalReallocations_Overview.status === 'success') {
      setExternalReallocations(response.externalReallocations_Overview.items);
      setTotal(response.externalReallocations_Overview.total ?? 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchExternalReallocations();
  }, [
    params.requested_by,
    params.budget_id,
    params.id,
    params.page,
    params.size,
    params.source_organization_unit_id,
    params.destination_organization_unit_id,
    params.status,
  ]);

  return {externalReallocations, total, loading, refetch: fetchExternalReallocations};
};

export default useGetExternalReallocations;
