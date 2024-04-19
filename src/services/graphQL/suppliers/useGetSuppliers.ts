import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {GetSuppliersParams, Supplier, SuppliersResponse} from '../../../types/graphQL/suppliers';

const useGetSuppliers = ({id, search, entity, parent_id}: GetSuppliersParams) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const {fetch, graphQl} = useAppContext();

  const fetchSuppliers = async () => {
    const response: SuppliersResponse['get'] = await fetch(graphQl.getSuppliersOverview, {
      id,
      search,
      entity,
      parent_id,
    });
    const suppliers = response?.suppliers_Overview.items;

    if (suppliers) setSuppliers(suppliers);

    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [id, search, entity, parent_id]);

  return {suppliers: suppliers, loading, refetch: fetchSuppliers};
};

export default useGetSuppliers;
