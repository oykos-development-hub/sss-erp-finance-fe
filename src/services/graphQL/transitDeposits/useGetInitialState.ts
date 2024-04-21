import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InitialStateResponse} from '../../../types/graphQL/initialState.ts';
import {PageParams} from '../../../types/graphQL/response.ts';
import {QueryOptions} from '../../../types/queries.ts';
import {ResponseStatus} from '../../../types/response.ts';
import {initialOverviewData} from '../../constants.ts';
import {GraphQL} from '../index.ts';

type GetInitialStateParams = {
  transitional_bank_account?: boolean;
  bank_account?: string | null;
  date?: string | null;
  organization_unit_id?: number;
} & PageParams;

const useGetInitialState = (
  {bank_account, date, organization_unit_id, transitional_bank_account}: GetInitialStateParams,
  opts?: QueryOptions<InitialStateResponse['getInitialState_Overview']>,
) => {
  const [initialState, setInitialState] =
    useState<InitialStateResponse['getInitialState_Overview']>(initialOverviewData);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchInitialState = async () => {
    setLoading(true);

    const response: InitialStateResponse = await fetch(GraphQL.getInitialState, {
      transitional_bank_account,
      bank_account,
      date,
      organization_unit_id,
    });

    if (response.getInitialState_Overview.status === ResponseStatus.Success) {
      setInitialState(response.getInitialState_Overview);

      if (opts?.onSuccess) opts.onSuccess();
    } else {
      if (opts?.onError) opts.onError();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchInitialState();
  }, [transitional_bank_account, bank_account, date, organization_unit_id]);

  return {data: initialState, loading, refetch: fetchInitialState};
};

export default useGetInitialState;
