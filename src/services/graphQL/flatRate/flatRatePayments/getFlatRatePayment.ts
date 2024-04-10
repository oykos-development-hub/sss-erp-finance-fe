const getFlatRatePayment = `query flatRatePaymentOverview($id: Int, $flat_rate_id: Int, $page:Int, $size:Int) {
    flatRatePayment_Overview(id: $id,flat_rate_id: $flat_rate_id,  page:$page, size:$size) {
        message
        total
        status
        items {
            id
            flat_rate_id
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

export default getFlatRatePayment;
