const payOrder = `query payDepositPaymentOrder($id: Int!, $id_of_statement: String!, $date_of_statement: String!) {
    payDepositPaymentOrder(id: $id, id_of_statement: $id_of_statement, date_of_statement: $date_of_statement) {
        status 
        message 
        data
		}
}`;

export default payOrder;
