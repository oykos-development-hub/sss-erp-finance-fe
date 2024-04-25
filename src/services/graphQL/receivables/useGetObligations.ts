import {useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {ObligationsItem, ObligationsParams} from '../../../types/graphQL/receivablesTypes';
import {ReceivablesResponse} from '../../../types/graphQL/response';
import obligationsOverview from './obligationsOverview';

const useGetObligations = (params: ObligationsParams) => {
  const [obligations, setObligations] = useState<ObligationsItem[]>([]);

  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchObligations = async (getMessage: () => void) => {
    const response: ReceivablesResponse['getObligations'] = await fetch(obligationsOverview, params);

    const items = response?.obligations_Overview?.items;
    if (response?.obligations_Overview?.message === "There aren't items!") {
      getMessage && getMessage();
    }

    setObligations(items);
    setLoading(false);
  };

  return {obligations, loading, fetchObligations};
};

export default useGetObligations;
