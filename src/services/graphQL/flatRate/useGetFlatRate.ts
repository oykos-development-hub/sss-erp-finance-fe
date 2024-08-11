import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {FlatRateResponse} from '../../../types/graphQL/response';
import {FlatRateOverviewItem, FlatRateParams} from '../../../types/graphQL/flatRate.ts';

const useGetFlatRate = (params: FlatRateParams) => {
  const [flatRates, setFlatRates] = useState<FlatRateOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchFlatRateOverview = async () => {
    setLoading(true);
    const response: FlatRateResponse['get'] = await fetch(GraphQL.flatRateOverview, params);

    if (response.flatRate_Overview.status === 'success') {
      setFlatRates(response.flatRate_Overview.items);
      setTotal(response.flatRate_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFlatRateOverview();
  }, [
    params.id,
    params.page,
    params.size,
    params.search,
    params.subject,
    params.flat_rate_type_id,
    params.organization_unit_id,
  ]);

  return {flatRates, loading, total, refetch: fetchFlatRateOverview};
};

export default useGetFlatRate;
