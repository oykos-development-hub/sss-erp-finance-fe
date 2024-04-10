const deleteFinePayment = `mutation($id: Int!) {
    finePayment_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteFinePayment;
