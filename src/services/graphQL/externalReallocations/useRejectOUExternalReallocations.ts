import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ExternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';

const useRejectOUExternalReallocations = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const rejectOUExternalReallocations = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: ExternalReallocationResponse['rejectOU'] = await fetch(GraphQL.rejectOUExternalReallocations, {
      id,
    });

    if (response.externalReallocationsOU_Reject.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, rejectOUExternalReallocations};
};

export default useRejectOUExternalReallocations;
