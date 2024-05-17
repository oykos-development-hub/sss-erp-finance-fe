import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {AccountingResponse} from '../../../types/graphQL/response';
import {GraphQL} from '../index.ts';
import {AccountingOrderItem} from '../../../types/graphQL/accountingTypes.ts';

const useAccountingEntryOverview = (
  organization_unit_id?: number,
  type?: string,
  search?: string,
  page?: number,
  size?: number,
) => {
  const [data, setData] = useState<AccountingOrderItem[]>([]);
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
