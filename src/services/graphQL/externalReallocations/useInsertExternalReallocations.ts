import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {GraphQL} from '../index.ts';
import {ExternalReallocationResponse} from './response.ts';
import {InsertExternalReallocationsFormData} from '../../../types/graphQL/externalReallocations.ts';

const useInsertExternalReallocations = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertExternalReallocations = async (
    data: InsertExternalReallocationsFormData,
    onSuccess: (id: number) => void,
    onError: () => void,
  ) => {
    setLoading(true);
    const response: ExternalReallocationResponse['insert'] = await fetch(GraphQL.insertExternalReallocations, {data});
    if (response?.externalReallocations_Insert?.status === 'success') {
      onSuccess && onSuccess(response.externalReallocations_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertExternalReallocations};
};

export default useInsertExternalReallocations;
