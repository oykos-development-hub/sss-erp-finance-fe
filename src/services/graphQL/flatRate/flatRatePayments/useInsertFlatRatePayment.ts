import {useState} from 'react';
import useAppContext from '../../../../context/useAppContext.ts';
import {FlatRatePaymentsResponse} from '../../../../types/graphQL/response.ts';
import {GraphQL} from '../../index.ts';
import {FlatRatePaymentForm} from '../../../../types/graphQL/flatRate.ts';

const useInsertFlatRatePayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertFlatRatePayment = async (
    data: FlatRatePaymentForm,
    onSuccess: (id: number) => void,
    onError: () => void,
  ) => {
    setLoading(true);
    const response: FlatRatePaymentsResponse['insert'] = await fetch(GraphQL.insertFlatRatePayment, {data});
    if (response?.flatRatePayment_Insert?.status === 'success') {
      onSuccess && onSuccess(response.flatRatePayment_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, insertFlatRatePayment};
};

export default useInsertFlatRatePayment;
