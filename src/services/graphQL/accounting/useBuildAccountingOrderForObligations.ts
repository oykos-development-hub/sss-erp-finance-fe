import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {AccountingOrderParams, AccountingOrderItem} from '../../../types/graphQL/accountingTypes.ts';
import {AccountingResponse} from '../../../types/graphQL/response.ts';

const useBuildAccountingOrderForObligations = () => {
  const [loading, setLoading] = useState(false);
  const [accountingOrder, setAccountingOrder] = useState<AccountingOrderItem[]>([]);
  const {fetch} = useAppContext();

  const buildAccountingOrderForObligations = async (
    data: AccountingOrderParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: AccountingResponse['build'] = await fetch(GraphQL.buildAccountingOrderForObligations, {data});

    if (response?.buildAccountingOrderForObligations?.status === 'success') {
      onSuccess && onSuccess();
      setAccountingOrder(response?.buildAccountingOrderForObligations?.items);
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {accountingOrder, loading, buildAccountingOrderForObligations};
};

export default useBuildAccountingOrderForObligations;
