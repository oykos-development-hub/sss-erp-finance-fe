import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InsertPaymentOrderParams} from '../../../types/graphQL/receivablesTypes.ts';
import {ReceivablesResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';

const useInsertPaymentOrder = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertPaymentOrder = async (data: InsertPaymentOrderParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: ReceivablesResponse['insert'] = await fetch(GraphQL.insertPaymentOrder, {data});
    if (response?.paymentOrder_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertPaymentOrder};
};

export default useInsertPaymentOrder;
