import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {InsertInvoiceParams} from '../../../types/graphQL/invoice.ts';
import {InvoiceResponse} from '../../../types/graphQL/response.ts';

const useInsertInvoice = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertInvoice = async (data: InsertInvoiceParams, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: InvoiceResponse['insert'] = await fetch(GraphQL.insertInvoice, {data});
    if (response?.invoice_Insert?.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, insertInvoice};
};

export default useInsertInvoice;
