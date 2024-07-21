import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {EnforcedPaymentReturnParams} from '../../../types/graphQL/enforcedPaymentTypes';
import {EnforcedPaymentResponse} from '../../../types/graphQL/response';

const useReturnEnforcedPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const returnEnforcedPayment = async (
    data: EnforcedPaymentReturnParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    if (loading) return;
    setLoading(true);
    const response: EnforcedPaymentResponse['return'] = await fetch(GraphQL.returnEnforcedPayment, data);
    if (response?.returnEnforcedPayment?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, returnEnforcedPayment};
};

export default useReturnEnforcedPayment;
