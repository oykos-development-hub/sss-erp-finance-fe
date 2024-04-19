import {useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {
  CalculatedAdditionalExpensesItem,
  CalculateAdditionalExpensesParams,
  CalculateAdditionalExpensesResponse,
} from '../../../types/graphQL/calculateAdditionalExpensesType';
import {GraphQL} from '..';
import {QueryOptions} from '../../../types/queries';

const useCalculateAdditionalExpenses = (
  {
    tax_authority_codebook_id,
    municipality_id,
    net_price,
    gross_price,
    previous_income_net,
    previous_income_gross,
  }: CalculateAdditionalExpensesParams,
  opts?: QueryOptions<CalculatedAdditionalExpensesItem[]>,
) => {
  const [data, setData] = useState<CalculatedAdditionalExpensesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const calculateAdditionalExpenses = async () => {
    const response: CalculateAdditionalExpensesResponse['get'] = await fetch(GraphQL.calculateAdditionalExpenses, {
      tax_authority_codebook_id,
      municipality_id,
      net_price,
      gross_price,
      previous_income_net,
      previous_income_gross,
    });
    const data = response?.calculateAdditionalExpenses.items;

    if (data) setData(data);

    if (opts?.onSuccess) opts.onSuccess(data);

    setLoading(false);
  };

  return {data: opts?.transform ? opts.transform(data) : data, loading, calculateAdditionalExpenses};
};

export default useCalculateAdditionalExpenses;
