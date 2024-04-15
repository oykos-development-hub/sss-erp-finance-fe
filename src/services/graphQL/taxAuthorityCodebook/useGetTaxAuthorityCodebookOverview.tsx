import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {TaxAuthorityCodebookItem, TaxAuthorityCodebookResponse} from '../../../types/graphQL/taxAuthorityCodebookType';

const useGetTaxAuthorityCodebook = () => {
  const [data, setData] = useState<TaxAuthorityCodebookItem[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch, graphQl} = useAppContext();

  const fetchGetTaxAuthorityCodebook = async () => {
    const response: TaxAuthorityCodebookResponse['get'] = await fetch(graphQl.taxAuthorityCodebookOverview);
    const data = response?.taxAuthorityCodebooks_Overview.items;

    if (data) setData(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchGetTaxAuthorityCodebook();
  }, []);

  return {data: data, loading, refetch: fetchGetTaxAuthorityCodebook};
};

export default useGetTaxAuthorityCodebook;
