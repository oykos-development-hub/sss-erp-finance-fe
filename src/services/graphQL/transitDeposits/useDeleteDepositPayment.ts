import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {DepositPaymentResponse} from '../../../types/graphQL/depositPayments.ts';
import {GraphQL} from '../index.ts';

const useDeleteDepositPayment = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteDepositPayment = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: DepositPaymentResponse['delete'] = await fetch(GraphQL.deleteDepositPayment, {id});
    if (response.depositPayment_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteDepositPayment};
};

export default useDeleteDepositPayment;
