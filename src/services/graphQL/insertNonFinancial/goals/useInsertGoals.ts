import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {GraphQL} from '../../index.ts';

const useInsertGoals = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertGoals = async (data: any, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await fetch(GraphQL.goalsInsert, {data});
    if (response.goalsNotFinancially_Insert.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
  };

  return {loading, insertGoals};
};

export default useInsertGoals;
