const insertFee = `
mutation($data: FeeMutation!) {
    fee_Insert(data: $data) {
        status 
        message 
        data
        item {
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
} `;

export default insertFee;
