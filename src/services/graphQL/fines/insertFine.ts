const insertFine = ` mutation($data: FineMutation!) {
    fine_Insert(data: $data) {
        status 
        message 
        data
        item {
           id
            act_type{
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
            account{
                id
                title
            }
            execution_date
            payment_deadline_date
            description
            status{
                id
                title
            }
            court_costs
            court_account{
                id
                title
            }
            fine_fee_details {
              fee_all_payments_amount 
              fee_amount_grace_period 
              fee_amount_grace_period_due_date
              fee_amount_grace_period_available 
              fee_left_to_pay_amount 
              fee_court_costs_paid 
              fee_court_costs_left_to_pay_amount
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

export default insertFine;
