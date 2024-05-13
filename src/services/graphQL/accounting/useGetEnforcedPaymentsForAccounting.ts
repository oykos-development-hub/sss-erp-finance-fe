import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {PaymentOrderItemForAccounting} from '../../../types/graphQL/accountingTypes';
import {AccountingResponse} from '../../../types/graphQL/response';
import {GraphQL} from '../index.ts';

const useGetEnforcedPaymentsForAccounting = (organization_unit_id: number, search: string) => {
  const [enforcedPaymentOrdersForAccounting, setEnforcedPaymentOrdersForAccounting] = useState<
    PaymentOrderItemForAccounting[]
  >([]);
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

    setEnforcedPaymentOrdersForAccounting(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnforcedPaymentsForAccounting();
  }, [organization_unit_id, search]);

  return {enforcedPaymentOrdersForAccounting, loading, fetch: fetchEnforcedPaymentsForAccounting};
};

export default useGetEnforcedPaymentsForAccounting;
