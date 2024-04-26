import {useEffect, useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext';
import {EnforcedPaymentItem, EnforcedPaymentParams} from '../../../types/graphQL/enforcedPaymentTypes';
import {EnforcedPaymentResponse} from '../../../types/graphQL/response';

const useGetEnforcedPayment = (params: EnforcedPaymentParams) => {
  const [total, setTotal] = useState<number>(0);
  const [enforcedPayment, setEnforcedPayment] = useState<EnforcedPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchPaymentOrder = async () => {
    const response: EnforcedPaymentResponse['get'] = await fetch(GraphQL.enforcedPaymentOverview, params);
    const totalNum = response?.enforcedPayment_Overview?.total;
    setTotal(totalNum || 0);

    const items = response?.enforcedPayment_Overview?.items;

    setEnforcedPayment(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentOrder();
  }, [params.page, params.size, params.id, params.organization_unit_id, params.status, params.search]);

  return {enforcedPayment, loading, total: total, fetch: fetchPaymentOrder};
};

export default useGetEnforcedPayment;
