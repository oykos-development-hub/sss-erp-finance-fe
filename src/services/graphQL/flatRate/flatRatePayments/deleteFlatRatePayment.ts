const deleteFlatRatePayment = `mutation($id: Int!) {
    flatRatePayment_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteFlatRatePayment;
