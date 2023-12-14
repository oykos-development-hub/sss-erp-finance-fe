import {useEffect, useState} from 'react';
import {GraphQL} from '../index.ts';
import {Count, CountResponse} from '../../../types/graphQL/counts';
import useAppContext from '../../../context/useAppContext.ts';

const useGetCountOverview = (id: number, tree: boolean) => {
  const [counts, setCounts] = useState<Count[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchCount = async (onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: CountResponse['get'] = await fetch(GraphQL.getCountOverview, {id, tree});
    if (response.account_Overview.status === 'success') {
      const accounts = response?.account_Overview.items;
      setCounts(accounts as Count[]);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCount();
  }, [id]);

  return {counts, loading, refetch: fetchCount};
};

export default useGetCountOverview;
