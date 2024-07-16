import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {FundReleaseItem, GetFundReleaseParams, GetFundReleaseResponse} from '../../../types/graphQL/fundRelease.ts';

const useGetFundRelease = (params: GetFundReleaseParams) => {
  const [fundRelease, setFundRelease] = useState<FundReleaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchFundRelease = async () => {
    setLoading(true);
    const response: GetFundReleaseResponse = await fetch(GraphQL.getFundRelease, params);

    if (response.spendingRelease_Overview.status === 'success') {
      setFundRelease(response.spendingRelease_Overview.items);
      setTotal(response.spendingRelease_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFundRelease();
  }, [params.year, params.month, params.hide, params.unit_id, params.budget_id, params.status]);

  return {fundRelease, loading, total, refetch: fetchFundRelease};
};

export default useGetFundRelease;
