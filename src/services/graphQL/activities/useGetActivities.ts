import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {ActivitiesResponse, Activity} from '../../../types/graphQL/activities.ts';

const useGetActivities = (id?: number, organization_unit_id?: number, sub_program_id?: number, search?: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const {fetch} = useAppContext();

  const fetchActivities = async () => {
    const response: ActivitiesResponse['get'] = await fetch(GraphQL.getActivities, {
      id,
      organization_unit_id,
      sub_program_id,
      search,
    });

    const countList = response?.activities_Overview.items;
    const totalCounts = response?.activities_Overview.total;

    if (countList) setActivities(countList);
    if (totalCounts) setTotal(totalCounts);

    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [id, organization_unit_id, sub_program_id, search]);

  return {activities, total, loading, refetch: fetchActivities};
};

export default useGetActivities;
