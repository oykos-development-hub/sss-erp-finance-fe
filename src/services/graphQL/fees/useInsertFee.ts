import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {FeeInsertParams, FeesResponse} from '../../../types/graphQL/fees.ts';
import {GraphQL} from '../index.ts';

const useInsertFee = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertFee = async (data: FeeInsertParams, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);
    const response: FeesResponse['insert'] = await fetch(GraphQL.insertFee, {data});
    if (response?.fee_Insert?.status === 'success') {
      onSuccess && onSuccess(response.fee_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertFee};
};

export default useInsertFee;
