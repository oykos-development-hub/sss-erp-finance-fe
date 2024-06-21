import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {ExternalReallocationResponse} from './response.ts';
import {GraphQL} from '../index.ts';
import {AcceptExternalReallocationsFormData} from '../../../types/graphQL/externalReallocations.ts';

const useAcceptOUExternalReallocations = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const acceptOUExternalReallocations = async (
    data: AcceptExternalReallocationsFormData,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (loading) return;
    setLoading(true);
    const response: ExternalReallocationResponse['acceptOU'] = await fetch(GraphQL.acceptOUExternalReallocations, {
      data,
    });

    if (response.externalReallocationsOU_Accept.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, acceptOUExternalReallocations};
};

export default useAcceptOUExternalReallocations;
