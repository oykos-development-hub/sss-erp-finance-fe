import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {PaymentOrderItemForAccounting} from '../../../types/graphQL/accountingTypes';
import {AccountingResponse} from '../../../types/graphQL/response';
import {GraphQL} from '../index.ts';

const useGetEnforcedPaymentsForAccounting = (organization_unit_id: number, search: string) => {
  const [paymentOrdersForAccounting, setPaymentOrdersForAccounting] = useState<PaymentOrderItemForAccounting[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchEnforcedPaymentsForAccounting = async () => {
    const response: AccountingResponse['getEnforcedPaymentOrders'] = await fetch(
      GraphQL.getEnforcedPaymentsForAccounting,
      {
        organization_unit_id,
        search,
      },
    );

    const items = response?.getEnforcedPaymentsForAccounting?.items;

    setPaymentOrdersForAccounting(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnforcedPaymentsForAccounting();
  }, [organization_unit_id, search]);

  return {paymentOrdersForAccounting, loading, fetch: fetchEnforcedPaymentsForAccounting};
};

export default useGetEnforcedPaymentsForAccounting;
