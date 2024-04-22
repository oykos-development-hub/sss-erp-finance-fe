const insertPaymentOrder = `mutation($data: PaymentOrderMutation!) {
    paymentOrder_Insert(data: $data) {
        status 
        message 
        data
        item {
         id
        organization_unit{
                    id
                    title
            }
            supplier{
                id
                title
            }
            amount
            bank_account
            date_of_payment
            date_of_sap
            id_of_statement
            sap_id
            status
            file{
                id
                name
                type
            }
            items{
                 id
                 invoice_id
                 additional_expenses_id
                 salary_additional_expenses_id
                 account{
                    id
                    title
                 }
                 amount
                 title
                 type
            }
            created_at
            updated_at
        }
    }
}`;

export default insertPaymentOrder;
