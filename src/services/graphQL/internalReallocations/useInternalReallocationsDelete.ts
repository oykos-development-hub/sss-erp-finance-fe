import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';

const useInternalReallocationsDelete = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteInternalReallocations = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: InternalReallocationResponse['delete'] = await fetch(GraphQL.internalReallocationDelete, {id});
    if (response.internalReallocations_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteInternalReallocations};
};

export default useInternalReallocationsDelete;
