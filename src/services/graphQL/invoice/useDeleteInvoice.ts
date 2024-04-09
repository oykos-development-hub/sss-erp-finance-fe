import {useState} from 'react';
import {GraphQL} from '..';
import useAppContext from '../../../context/useAppContext.ts';
import {InvoiceResponse} from '../../../types/graphQL/response.ts';

const useDeleteInvoice = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteInvoice = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    if (loading) return;
    setLoading(true);
    const response: InvoiceResponse['delete'] = await fetch(GraphQL.deleteInvoice, {id});
    if (response.invoice_Delete.status === 'success') {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }

    setLoading(false);
  };

  return {loading, deleteInvoice};
};

export default useDeleteInvoice;
