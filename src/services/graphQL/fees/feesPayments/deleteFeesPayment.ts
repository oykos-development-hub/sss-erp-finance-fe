const deleteFeesPayment = `mutation($id: Int!) {
    feePayment_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteFeesPayment;
