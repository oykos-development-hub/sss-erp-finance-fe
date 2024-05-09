import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {ObligationsItemForAccounting} from '../../../types/graphQL/accountingTypes';
import {AccountingResponse} from '../../../types/graphQL/response';
import {GraphQL} from '../index.ts';

const useAccountingEntryOverview = (
  organization_unit_id: number,
  type: string | null,
  search: string,
  page: number,
  size: number,
) => {
  const [data, setData] = useState<ObligationsItemForAccounting[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const accountingEntryOverview = async () => {
    const response: AccountingResponse['getAccountingEntry'] = await fetch(GraphQL.accountingEntryOverview, {
      organization_unit_id,
      type,
      search,
      page,
      size,
    });
    const totalNum = response?.accountingEntry_Overview?.total;
    const items = response?.accountingEntry_Overview?.items;

    setTotal(totalNum || 0);
    setData(items);
    setLoading(false);
  };

  useEffect(() => {
    accountingEntryOverview();
  }, [organization_unit_id, type, search, page, size]);

  return {data, loading, total, fetch: accountingEntryOverview};
};

export default useAccountingEntryOverview;
