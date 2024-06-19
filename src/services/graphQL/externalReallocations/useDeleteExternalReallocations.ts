import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ExternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';

const useDeleteExternalReallocations = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteExternalReallocations = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: ExternalReallocationResponse['delete'] = await fetch(GraphQL.deleteExternalReallocations, {
      id,
    });

    if (response.externalReallocations_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteExternalReallocations};
};

export default useDeleteExternalReallocations;
