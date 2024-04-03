const deletePayment = `mutation($id: Int!) {
    finePayment_Delete(id: $id) {
        message
        status
    }
}`;

export default deletePayment;
