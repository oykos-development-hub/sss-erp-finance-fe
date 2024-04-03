const getPayments = `query finePaymentOverview($id: Int, $fine_id: Int, $page:Int, $size:Int) {
    finePayment_Overview(id: $id,fine_id: $fine_id,  page:$page, size:$size) {
        status
        message
        total
        items {
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
}`;

export default getPayments;
