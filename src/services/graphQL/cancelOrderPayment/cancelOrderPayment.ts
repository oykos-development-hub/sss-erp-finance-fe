const cancelOrderPayment = `query cancelPaymentOrder($id: Int!) {
    cancelPaymentOrder(id: $id) {
        status 
        message 
        data
		}
}`;

export default cancelOrderPayment;
