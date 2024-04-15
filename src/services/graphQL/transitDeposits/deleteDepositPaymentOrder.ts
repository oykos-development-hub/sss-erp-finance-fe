const deleteDepositPaymentOrder = `mutation($id: Int!) {
    depositPaymentOrder_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteDepositPaymentOrder;
