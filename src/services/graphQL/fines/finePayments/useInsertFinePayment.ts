import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {FinesPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';
import {FinePaymentForm} from '../../../../types/graphQL/finePaymentForm.ts';

const useInsertFinePayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertFinePayment = async (data: FinePaymentForm, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);
    const response: FinesPaymentsResponse['insert'] = await fetch(GraphQL.insertFinePayment, {data});
    if (response?.finePayment_Insert?.status === 'success') {
      onSuccess && onSuccess(response.finePayment_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertFinePayment};
};

export default useInsertFinePayment;
