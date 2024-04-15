import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {
  DepositPayment,
  DepositPaymentInsertData,
  DepositPaymentResponse,
} from '../../../types/graphQL/depositPayments.ts';

const useInsertDepositPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertDepositPayment = async (
    data: DepositPaymentInsertData,
    onSuccess?: (item: DepositPayment) => void,
    onError?: () => void,
  ) => {
    setLoading(true);

    const response: DepositPaymentResponse['insert'] = await fetch(GraphQL.insertDepositPayment, {data});
    if (response?.depositPayment_Insert?.status === 'success') {
      onSuccess && onSuccess(response.depositPayment_Insert.item);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertDepositPayment};
};

export default useInsertDepositPayment;
