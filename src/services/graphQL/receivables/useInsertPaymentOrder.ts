import {useState} from 'react';
import useAppContext from '../../../context/useAppContext.ts';
import {InsertPaymentOrderParams} from '../../../types/graphQL/receivablesTypes.ts';
import {ReceivablesResponse} from '../../../types/graphQL/response.ts';
import {GraphQL} from '../index.ts';

const useInsertPaymentOrder = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertPaymentOrder = async (
    data: InsertPaymentOrderParams,
    onSuccess?: () => void,
    onError?: (message: string) => void,
  ) => {
    setLoading(true);
    const response: ReceivablesResponse['insert'] = await fetch(GraphQL.insertPaymentOrder, {data});
    if (response?.paymentOrder_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError(response?.paymentOrder_Insert?.message);
    }

    setLoading(false);
  };

  return {loading, insertPaymentOrder};
};

export default useInsertPaymentOrder;
