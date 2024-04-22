const deletePaymentOrder = `mutation($id: Int!) {
    paymentOrder_Delete(id: $id) {
        message
        status
    }
}`;

export default deletePaymentOrder;
