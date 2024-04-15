import {useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {
  CalculateAdditionalExpensesItem,
  CalculateAdditionalExpensesParams,
  CalculateAdditionalExpensesResponse,
} from '../../../types/graphQL/calculateAdditionalExpensesType';
import {GraphQL} from '..';

const useCalculateAdditionalExpenses = ({
  tax_authority_codebook_id,
  municipality_id,
  net_price,
  gross_price,
  previous_income_net,
  previous_income_gross,
}: CalculateAdditionalExpensesParams) => {
  const [data, setData] = useState<CalculateAdditionalExpensesItem[]>([]);
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
    setLoading(false);
  };

  return {data: data, loading, calculateAdditionalExpenses};
};

export default useCalculateAdditionalExpenses;
