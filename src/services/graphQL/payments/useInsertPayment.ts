import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {PaymentsResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';
import {FinePaymentForm} from '../../../types/graphQL/finePaymentForm.ts';

const useInsertPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertPayment = async (data: FinePaymentForm, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);
    const response: PaymentsResponse['insert'] = await fetch(GraphQL.insertPayment, {data});
    if (response?.finePayment_Insert?.status === 'success') {
      onSuccess && onSuccess(response.finePayment_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertPayment};
};

export default useInsertPayment;
