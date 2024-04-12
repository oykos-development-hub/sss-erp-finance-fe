import {useEffect, useState} from 'react';
import {GraphQL} from '../index.ts';
import useAppContext from '../../../context/useAppContext.ts';
import {PageParams} from '../../../types/graphQL/response.ts';
import {Will, WillResponse} from '../../../types/graphQL/wills.ts';

type GetWillsParams = {
  id?: number | null;
  status?: string;
  search?: string;
  organization_unit_id?: number | null;
} & PageParams;

const useGetWills = (params: GetWillsParams) => {
  const [wills, setWills] = useState<Will[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchWills = async () => {
    setLoading(true);
    const response: WillResponse['get'] = await fetch(GraphQL.getWill, params);

    if (response.fixedDepositWill_Overview.status === 'success') {
      setWills(response.fixedDepositWill_Overview.items);
      setTotal(response.fixedDepositWill_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchWills();
  }, [params.id, params.page, params.size, params.search, params.status, params.organization_unit_id]);

  return {data: wills, loading, total, refetch: fetchWills};
};

export default useGetWills;
