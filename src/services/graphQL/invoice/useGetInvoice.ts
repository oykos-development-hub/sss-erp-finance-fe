import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {GetInvoiceParams, InvoiceItem} from '../../../types/graphQL/invoice';
import {InvoiceResponse} from '../../../types/graphQL/response';
import getInvoice from './getInvoice';

const useGetInvoice = (params: GetInvoiceParams) => {
  const [total, setTotal] = useState<number>(0);
  const [invoice, setInvoice] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchInvoice = async () => {
    const response: InvoiceResponse['get'] = await fetch(getInvoice, params);
    const totalNum = response?.invoice_Overview?.total;
    setTotal(totalNum || 0);

    const items = response?.invoice_Overview?.items;

    setInvoice(items);
    setLoading(false);
    console.log(response, 'invoiceinvoiceinvoiceinvoice');
  };

  useEffect(() => {
    fetchInvoice();
  }, [params.page, params.size, params.id, params.supplier_id, params.status, params.search, params.year]);

  return {invoice, loading, total: total, fetch: fetchInvoice};
};

export default useGetInvoice;
