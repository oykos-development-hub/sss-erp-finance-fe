import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {Count, CountResponse} from '../../../types/graphQL/counts';
import getCountOverview from './getCountOverview.ts';

interface ICountParams {
  id?: number;
  level?: number; // starts from 0
  tree?: boolean;
  page?: number;
  size?: number;
  search?: string;
}

const useGetCountOverview = ({id, level, page, search, size, tree}: ICountParams) => {
  const [counts, setCounts] = useState<Count[]>([]);
  const [total, setTotal] = useState<number>(0);

  const {fetch} = useAppContext();
  const fetchCounts = async () => {
    const response: CountResponse['get'] = await fetch(getCountOverview, {level, page, search, size, tree, id});
    const countList = response?.account_Overview.items;
    const totalCounts = response?.account_Overview.total;

    if (countList) setCounts(countList);
    if (totalCounts) setTotal(totalCounts);
  };
  useEffect(() => {
    fetchCounts();
  }, [level, page, search, size, tree]);
  return {counts, total};
};

export default useGetCountOverview;
