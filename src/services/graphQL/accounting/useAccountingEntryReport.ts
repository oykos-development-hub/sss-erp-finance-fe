import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';

const useAccountingEntryReport = () => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchAccountingOverview = async (organization_unit_id?: number, type?: string) => {
    setLoading(true);

    try {
      const response = await fetch(GraphQL.accountingEntryOverview, {
        organization_unit_id,
        type,
      });

      setLoading(false);
      setTotal(response?.accountingEntry_Overview.total);

      return response?.accountingEntry_Overview.items;
    } catch (err) {
      console.log(err);
    }
  };

  return {fetchAccountingOverview, loading, total};
};

export default useAccountingEntryReport;
