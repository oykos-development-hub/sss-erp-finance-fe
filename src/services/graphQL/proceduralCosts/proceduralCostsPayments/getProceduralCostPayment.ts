const getProceduralCostPayment = `query procedureCostPaymentOverview($id: Int, $procedure_cost_id: Int, $page:Int, $size:Int) {
    procedureCostPayment_Overview(id: $id,procedure_cost_id: $procedure_cost_id,  page:$page, size:$size) {
        message
        total
        status
        items {
            id
            procedure_cost_id
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

export default getProceduralCostPayment;
