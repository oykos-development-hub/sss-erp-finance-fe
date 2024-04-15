import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {
  AdditionalExpensesItem,
  GetAdditionalExpensesParams,
  GetAdditionalExpensesResponse,
} from '../../../types/graphQL/additionalExpenses';

const useAdditionalExpensesOverview = ({
  id,
  year,
  status,
  search,
  organization_unit_id,
  page,
  size,
  subject_id,
}: GetAdditionalExpensesParams) => {
  const [additionalExpenses, setAdditionalExpenses] = useState<AdditionalExpensesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>();
  const {fetch} = useAppContext();

  const fetchAdditionalExpenses = async () => {
    const response: GetAdditionalExpensesResponse['get'] = await fetch(GraphQL.additionalExpensesOverview, {
      id,
      search,
      year,
      status,
      organization_unit_id,
      page,
      size,
      subject_id,
    });
    const additionalExpenses = response?.additionalExpenses_Overview.items;

    if (additionalExpenses) setAdditionalExpenses(additionalExpenses);

    setLoading(false);
    setTotal(response.additionalExpenses_Overview.total);
  };

  useEffect(() => {
    fetchAdditionalExpenses();
  }, [id, search, year, status, organization_unit_id, page, size, subject_id]);

  return {additionalExpenses, total, loading, refetch: fetchAdditionalExpenses};
};

export default useAdditionalExpensesOverview;
