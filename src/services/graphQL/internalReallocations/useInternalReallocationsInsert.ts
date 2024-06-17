import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';

const useInternalReallocationsInsert = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertInternalReallocations = async (data: any, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);
    const response: InternalReallocationResponse['insert'] = await fetch(GraphQL.internalReallocationInsert, {data});
    if (response?.internalReallocations_Insert?.status === 'success') {
      onSuccess && onSuccess(response.internalReallocations_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertInternalReallocations};
};

export default useInternalReallocationsInsert;
