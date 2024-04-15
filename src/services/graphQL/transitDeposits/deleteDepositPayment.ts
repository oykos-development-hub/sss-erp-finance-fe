const deleteDepositPayment = `mutation($id: Int!) {
    depositPayment_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteDepositPayment;
