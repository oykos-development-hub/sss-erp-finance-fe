const payPaymentOrder = `query payPaymentOrder($id: Int!, $sap_id: String!, $date_of_sap: String!) {
    payPaymentOrder(id: $id, sap_id: $sap_id, date_of_sap: $date_of_sap) {
        status 
        message 
        data
		}
}`;

export default payPaymentOrder;
