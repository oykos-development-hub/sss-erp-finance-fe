import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {SalariesResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {SalaryInsertParams} from '../../../types/graphQL/salaries.ts';

const useInsertSalary = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertSalary = async (data: SalaryInsertParams, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);
    const response: SalariesResponse['insert'] = await fetch(GraphQL.insertSalary, {data});
    if (response?.salary_Insert?.status === 'success') {
      onSuccess && onSuccess(response.salary_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertSalary};
};

export default useInsertSalary;
