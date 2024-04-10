const getFeesPayments = `query feePaymentOverview($id: Int, $fee_id: Int, $page:Int, $size:Int) {
    feePayment_Overview(id: $id,fee_id: $fee_id,  page:$page, size:$size) {
        message
        total
        status
        items {
            id
            fee_id
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
}`;

export default getFeesPayments;
