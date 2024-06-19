import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ExternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';

const useRejectSSSExternalReallocations = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const rejectSSSExternalReallocations = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: ExternalReallocationResponse['rejectSSS'] = await fetch(GraphQL.rejectSSSExternalReallocations, {
      id,
    });

    if (response.externalReallocationsSSS_Reject.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, rejectSSSExternalReallocations};
};

export default useRejectSSSExternalReallocations;
