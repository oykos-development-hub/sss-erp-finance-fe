import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {PageParams} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {FeesResponse} from '../../../types/graphQL/fees.ts';
import {Fee} from '../../../screens/finesAndTaxes/taxes/constants.tsx';

type GetFeesParams = PageParams & {
  id?: number;
  fee_subcategory_id?: number | null;
  search?: string;
  fee_type_id?: number | null;
  organization_unit_id?: number | null;
};

const useGetFees = (params: GetFeesParams) => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchFeesOverview = async () => {
    setLoading(true);
    const response: FeesResponse['get'] = await fetch(GraphQL.getFeesOverview, params);

    if (response.fee_Overview.status === 'success') {
      setFees(response.fee_Overview.items);
      setTotal(response.fee_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFeesOverview();
  }, [
    params.id,
    params.fee_subcategory_id,
    params.fee_type_id,
    params.page,
    params.search,
    params.size,
    params.organization_unit_id,
  ]);

  return {fees, loading, total, refetch: fetchFeesOverview};
};

export default useGetFees;
