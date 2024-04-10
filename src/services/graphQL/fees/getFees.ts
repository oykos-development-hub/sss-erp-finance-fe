const getFeesOverview = `query feeOverview($id: Int,   $fee_subcategory: Int, $search: String, $fee_type: Int, $page:Int, $size:Int) {
    fee_Overview(id: $id, fee_subcategory: $fee_subcategory, search: $search, fee_type: $fee_type,    page:$page, size:$size) {
        message
        status
        total
        items {
            id
             fee_type
            fee_subcategory
            decision_number
            decision_date
            subject
            jmbg
            residence
            amount
            payment_reference_number
            debit_reference_number
            execution_date
            payment_deadline_date
            description
            status{
                id
                title
            }
            court_account{
                id
                title
            }
            fee_details {
              fee_all_payments_amount  
              fee_left_to_pay_amount 
            }
            file{
                id
                name
                type
            }
            created_at
            updated_at
        }
    }
}`;

export default getFeesOverview;
