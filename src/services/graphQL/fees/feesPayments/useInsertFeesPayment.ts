import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {FeesPaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';
import {FeePaymentForm} from '../../../../types/graphQL/feePaymentForm.ts';

const useInsertFeesPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertFeePayment = async (data: FeePaymentForm, onSuccess: (id: number) => void, onError: () => void) => {
    setLoading(true);
    const response: FeesPaymentsResponse['insert'] = await fetch(GraphQL.insertFeePayment, {data});
    if (response?.feePayment_Insert?.status === 'success') {
      onSuccess && onSuccess(response.feePayment_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertFeePayment};
};

export default useInsertFeesPayment;
