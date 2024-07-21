const returnEnforcedPayment = `query returnEnforcedPayment($id: Int!, $return_file_id: Int!, $return_date: String!) {
    returnEnforcedPayment(id: $id, return_file_id: $return_file_id, return_date: $return_date) {
        status 
        message 
        data
    }
}`;

export default returnEnforcedPayment;
