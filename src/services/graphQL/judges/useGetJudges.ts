import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {Judge, JudgesOverviewQueryParams, JudgesResponse} from '../../../types/graphQL/judges';
import {REQUEST_STATUSES} from '../../constants';

const ueGetJudges = ({organization_unit, user_profile, page, size, search}: JudgesOverviewQueryParams) => {
  const [judges, setJudges] = useState<(Judge & {title: string})[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchJudges = async () => {
    setLoading(true);

    const response: JudgesResponse = await fetch(GraphQL.getJudges, {
      user_profile: user_profile,
      organization_unit: organization_unit,
      page: page,
      size: size,
      search: search,
    });

    if (response.judges_Overview?.status === REQUEST_STATUSES.success) {
      const updatedList = response.judges_Overview.items.map(item => ({
        ...item,
        title: `${item.first_name} ${item.last_name}`,
        relocation: item?.norms[0]?.relocation,
      }));

      setTotal(response.judges_Overview?.total ?? 0);
      setJudges(updatedList as (Judge & {title: string})[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJudges();
  }, [user_profile, organization_unit, page, size, search]);

  return {judges: judges || [], total, loading, refetch: fetchJudges};
};

export default ueGetJudges;
