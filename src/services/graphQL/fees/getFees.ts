const getFeesOverview = `query feeOverview($id: Int,   $fee_subcategory_id: Int, $search: String, $fee_type_id: Int, $page:Int, $size:Int, $organization_unit_id: Int) {
    fee_Overview(id: $id, fee_subcategory_id: $fee_subcategory_id, search: $search, fee_type_id: $fee_type_id,    page:$page, size:$size, organization_unit_id: $organization_unit_id) {
        message
        status
        total
        items {
            id
             fee_type{
                id
                title
            }
            fee_subcategory{
                id
                title
            }
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
                fee_left_to_pay_amount
                fee_all_payments_amount
                fee_amount_grace_period
                fee_amount_grace_period_due_date
                fee_amount_grace_period_available
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
