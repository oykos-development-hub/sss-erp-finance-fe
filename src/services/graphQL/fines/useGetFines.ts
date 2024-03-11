import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {FinesOverviewParams} from '../../../types/graphQL/finesOverview.ts';
import {FinesResponse} from '../../../types/graphQL/response';
import {initialOverviewData} from '../../constants';

const useGetFines = (params: FinesOverviewParams, onSuccess?: () => void, onError?: () => void) => {
  const [fine, setFines] = useState<FinesResponse['get']['fine_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchFinesOverview = async () => {
    setLoading(true);
    const response: FinesResponse['get'] = await fetch(GraphQL.finesOverview, params);

    if (response.fine_Overview.status === 'success') {
      setFines(response.fine_Overview);
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFinesOverview();
  }, [params.id, params.page, params.size, params.search, params.subject, params.act_type_id]);

  return {fine, loading, refetch: fetchFinesOverview};
};

export default useGetFines;
