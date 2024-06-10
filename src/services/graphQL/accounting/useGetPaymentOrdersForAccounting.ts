import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {PaymentOrderItemForAccounting} from '../../../types/graphQL/accountingTypes';
import {AccountingResponse} from '../../../types/graphQL/response';
import {GraphQL} from '../index.ts';

const useGetPaymentOrdersForAccounting = (
  organization_unit_id: number,
  search: string,
  date_of_start?: string | null,
  date_of_end?: string | null,
) => {
  const [paymentOrdersForAccounting, setPaymentOrdersForAccounting] = useState<PaymentOrderItemForAccounting[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchPaymentOrdersForAccounting = async () => {
    const response: AccountingResponse['getPaymentOrders'] = await fetch(GraphQL.getPaymentOrdersForAccounting, {
      organization_unit_id,
      search,
      date_of_start,
      date_of_end,
    });

    const items = response?.getPaymentOrdersForAccounting?.items;

    setPaymentOrdersForAccounting(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentOrdersForAccounting();
  }, [organization_unit_id, search, date_of_start, date_of_end]);

  return {paymentOrdersForAccounting, loading, fetch: fetchPaymentOrdersForAccounting};
};

export default useGetPaymentOrdersForAccounting;
