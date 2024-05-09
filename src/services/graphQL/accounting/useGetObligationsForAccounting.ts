import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {ObligationsItemForAccounting} from '../../../types/graphQL/accountingTypes';
import {AccountingResponse} from '../../../types/graphQL/response';
import {GraphQL} from '../index.ts';

const useGetObligationsForAccounting = (organization_unit_id: number, type: string | null, search: string) => {
  const [obligationsForAccounting, setObligationsForAccounting] = useState<ObligationsItemForAccounting[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchObligationsForAccounting = async () => {
    const response: AccountingResponse['get'] = await fetch(GraphQL.getObligationsForAccounting, {
      organization_unit_id,
      type,
      search,
    });

    const items = response?.getObligationsForAccounting?.items;

    setObligationsForAccounting(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchObligationsForAccounting();
  }, [organization_unit_id, type, search]);

  return {obligationsForAccounting, loading, fetch: fetchObligationsForAccounting};
};

export default useGetObligationsForAccounting;
