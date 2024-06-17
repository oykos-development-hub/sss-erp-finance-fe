import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';
import {InternalReallocationsOverviewParams} from '../../../types/graphQL/internalReallocations.ts';

const useInternalReallocationsOverview = (params: InternalReallocationsOverviewParams) => {
  const [internalReallocationsOverview, setInternalReallocationsOverview] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchInternalReallocationsOverview = async () => {
    setLoading(true);
    const response: InternalReallocationResponse['get'] = await fetch(GraphQL.internalReallocationOverview, params);

    if (response.internalReallocations_Overview.status === 'success') {
      setInternalReallocationsOverview(response.internalReallocations_Overview.items);
      setTotal(response.internalReallocations_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    !params.skip && fetchInternalReallocationsOverview();
  }, [
    params.id,
    params.page,
    params.size,
    params.organization_unit_id,
    params.year,
    params.requested_by,
    params.budget_id,
    params.skip,
  ]);

  return {internalReallocationsOverview, loading, total, refetch: fetchInternalReallocationsOverview};
};

export default useInternalReallocationsOverview;
