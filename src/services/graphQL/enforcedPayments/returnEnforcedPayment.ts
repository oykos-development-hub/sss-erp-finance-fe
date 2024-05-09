const returnEnforcedPayment = `query returnEnforcedPayment($id: Int!, $return_file_id: Int!, $return_date: String!, $return_amount: Float!) {
    returnEnforcedPayment(id: $id, return_file_id: $return_file_id, return_date: $return_date, return_amount: $return_amount) {
        status 
        message 
        data
	}
}`;

export default returnEnforcedPayment;
