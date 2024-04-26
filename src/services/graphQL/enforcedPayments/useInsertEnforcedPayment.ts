import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {EnforcedPaymentInsertParams} from '../../../types/graphQL/enforcedPaymentTypes.ts';
import {EnforcedPaymentResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';

const useInsertEnforcedPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertEnforcedPayment = async (
    data: EnforcedPaymentInsertParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: EnforcedPaymentResponse['insert'] = await fetch(GraphQL.enforcedPaymentInsert, {data});
    if (response?.enforcedPayment_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertEnforcedPayment};
};

export default useInsertEnforcedPayment;
