import {SalariesResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';

const useDeleteSalary = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteSalary = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: SalariesResponse['delete'] = await fetch(GraphQL.deleteSalary, {id});
    if (response.salary_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteSalary};
};

export default useDeleteSalary;
