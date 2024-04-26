import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {GetInvoiceParams, InvoiceItem} from '../../../types/graphQL/invoice';
import {InvoiceResponse} from '../../../types/graphQL/response';
import getInvoice from './getInvoice';

const useGetInvoice = (params: GetInvoiceParams, isEnforcedPayment?: boolean) => {
  const [total, setTotal] = useState<number>(0);
  const [invoice, setInvoice] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchInvoice = async (getMessage?: () => void) => {
    const response: InvoiceResponse['get'] = await fetch(getInvoice, params);
    const totalNum = response?.invoice_Overview?.total;
    setTotal(totalNum || 0);

    const items = response?.invoice_Overview?.items;
    if (response?.invoice_Overview?.message === 'There aren`t item!') {
      getMessage && getMessage();
    }

    setInvoice(items);
    setLoading(false);
  };

  {
    !isEnforcedPayment &&
      useEffect(() => {
        fetchInvoice();
      }, [
        params.page,
        params.size,
        params.id,
        params.supplier_id,
        params.status,
        params.search,
        params.year,
        params.organization_unit_id,
      ]);
  }

  return {invoice, loading, total: total, fetch: fetchInvoice, fetchInvoice};
};

export default useGetInvoice;
