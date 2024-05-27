import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {PaymentOrderItem, PaymentOrderParams} from '../../../types/graphQL/receivablesTypes';
import {ReceivablesResponse} from '../../../types/graphQL/response';
import paymentOrderOverview from './paymentOrderOverview';

const useGetPaymentOrder = (params: PaymentOrderParams) => {
  const [total, setTotal] = useState<number>(0);
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchPaymentOrder = async () => {
    const response: ReceivablesResponse['get'] = await fetch(paymentOrderOverview, params);
    const totalNum = response?.paymentOrder_Overview?.total;
    setTotal(totalNum || 0);

    const items = response?.paymentOrder_Overview?.items;

    setPaymentOrder(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentOrder();
  }, [
    params.page,
    params.size,
    params.id,
    params.organization_unit_id,
    params.status,
    params.search,
    params.year,
    params.supplier_id,
  ]);

  return {paymentOrder, loading, total: total, fetch: fetchPaymentOrder};
};

export default useGetPaymentOrder;
