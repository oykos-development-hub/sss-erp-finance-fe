import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {PaymentOrderItemForAccounting} from '../../../types/graphQL/accountingTypes';
import {AccountingResponse} from '../../../types/graphQL/response';
import {GraphQL} from '../index.ts';

const useGetReturnedEnforcedPaymentsForAccounting = (
  organization_unit_id: number,
  search: string,
  date_of_start?: string | null,
  date_of_end?: string | null,
) => {
  const [returnedEnforcedPaymentsForAccounting, setReturnedEnforcedPaymentsForAccounting] = useState<
    PaymentOrderItemForAccounting[]
  >([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchReturnedEnforcedPaymentsForAccounting = async () => {
    const response: AccountingResponse['getReturnedEnforcedPaymentsForAccounting'] = await fetch(
      GraphQL.getReturnedEnforcedPaymentsForAccounting,
      {
        organization_unit_id,
        search,
        date_of_start,
        date_of_end,
      },
    );

    const items = response?.getReturnedEnforcedPaymentsForAccounting?.items;

    setReturnedEnforcedPaymentsForAccounting(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchReturnedEnforcedPaymentsForAccounting();
  }, [organization_unit_id, search, date_of_end, date_of_start]);

  return {returnedEnforcedPaymentsForAccounting, loading, fetch: fetchReturnedEnforcedPaymentsForAccounting};
};

export default useGetReturnedEnforcedPaymentsForAccounting;
