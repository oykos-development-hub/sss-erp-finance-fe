const deleteInvoice = `mutation($id: Int!) {
    invoice_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteInvoice;
