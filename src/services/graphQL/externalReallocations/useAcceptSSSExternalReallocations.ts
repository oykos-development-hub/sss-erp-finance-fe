import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ExternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';

const useAcceptSSSExternalReallocations = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const acceptSSSExternalReallocations = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: ExternalReallocationResponse['acceptSSS'] = await fetch(GraphQL.acceptSSSExternalReallocations, {
      id,
    });

    if (response.externalReallocationsSSS_Accept.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, acceptSSSExternalReallocations};
};

export default useAcceptSSSExternalReallocations;
