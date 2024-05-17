import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';

const useAnalyticalCardOverview = () => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchAnalyticalCardOverview = async (
    organization_unit_id: number,
    supplier_id?: number,
    date_of_start?: string | null,
    date_of_end?: string | null,
    date_of_start_booking?: string | null,
    date_of_end_booking?: string | null,
  ) => {
    setLoading(true);

    try {
      const response = await fetch(GraphQL.analyticalCardOverview, {
        organization_unit_id,
        supplier_id,
        date_of_start,
        date_of_end,
        date_of_start_booking,
        date_of_end_booking,
      });

      setLoading(false);
      setTotal(response?.analyticalCard_Overview.total);

      return response?.analyticalCard_Overview.items;
    } catch (err) {
      console.log(err);
    }
  };

  return {fetchAnalyticalCardOverview, loading, total};
};

export default useAnalyticalCardOverview;
