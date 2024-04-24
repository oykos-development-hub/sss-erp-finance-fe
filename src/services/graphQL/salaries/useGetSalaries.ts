import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {Salary, SalariesOverviewParams} from '../../../types/graphQL/salaries.ts';
import {SalariesResponse} from '../../../types/graphQL/response';

const useGetSalaries = (params: SalariesOverviewParams) => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {fetch} = useAppContext();

  const fetchSalariesOverview = async () => {
    setLoading(true);
    const response: SalariesResponse['get'] = await fetch(GraphQL.salariesOverview, params);

    if (response.salary_Overview.status === 'success') {
      setSalaries(response.salary_Overview.items);
      setTotal(response.salary_Overview.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSalariesOverview();
  }, [params.id, params.page, params.size, params.activity_id, params.organization_unit_id, params.year, params.month]);

  return {salaries, loading, total, refetch: fetchSalariesOverview};
};

export default useGetSalaries;
