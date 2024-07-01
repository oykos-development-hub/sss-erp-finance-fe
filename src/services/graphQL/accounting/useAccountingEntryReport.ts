import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';

const useAccountingEntryReport = () => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchAccountingOverview = async (
    organization_unit_id?: number,
    type?: string,
    date_of_start?: string | null,
    date_of_end?: string | null,
    group?: boolean,
  ) => {
    setLoading(true);

    try {
      const response = await fetch(GraphQL.accountingEntryOverview, {
        organization_unit_id,
        type,
        date_of_start,
        date_of_end,
        group,
      });

      setLoading(false);
      setTotal(response?.accountingEntry_Overview.total);

      return response?.accountingEntry_Overview;
    } catch (err) {
      console.log(err);
    }
  };

  return {fetchAccountingOverview, loading, total};
};

export default useAccountingEntryReport;
