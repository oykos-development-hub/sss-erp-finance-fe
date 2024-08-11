import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {FinesOverviewItem, FinesOverviewParams} from '../../../types/graphQL/finesOverview.ts';
import {FinesResponse} from '../../../types/graphQL/response';

const useGetFines = (params: FinesOverviewParams) => {
  const [fines, setFines] = useState<FinesOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchFinesOverview = async () => {
    setLoading(true);
    const response: FinesResponse['get'] = await fetch(GraphQL.finesOverview, params);

    if (response.fine_Overview.status === 'success') {
      setFines(response.fine_Overview.items);
      setTotal(response.fine_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFinesOverview();
  }, [
    params.id,
    params.page,
    params.size,
    params.search,
    params.subject,
    params.act_type_id,
    params.organization_unit_id,
  ]);

  return {fines, loading, total, refetch: fetchFinesOverview};
};

export default useGetFines;
