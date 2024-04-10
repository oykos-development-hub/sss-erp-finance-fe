const insertFinePayment = ` mutation($data: FinePaymentMutation!) {
    finePayment_Insert(data: $data) {
        status 
        message 
        data
          item {
            id
            fine_id
            payment_method{
                id
                title
            }
            amount
            payment_date
            payment_due_date
            receipt_number
            payment_reference_number
            debit_reference_number
            status{
                id
                title
            }
            created_at
            updated_at
        }
    }
} `;

export default insertFinePayment;
