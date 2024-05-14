const buildAccountingOrderForObligations = `mutation($data: AccountingOrderForObligationsMutation!) {
    buildAccountingOrderForObligations(data: $data) {
        status 
        message 
        data
        items {
         organization_unit{
            id
            title
         }
         date_of_booking
         credit_amount
         debit_amount
         items{
            id
            account{
                id
                title
            }
            supplier_id
            title
            credit_amount
            debit_amount
            type
            date
            invoice{
                id
                title
            }
            salary{
                id
                title
            }
            return_enforced_payment{
                id
                title
            }
            payment_order{
                id
                title
            }
            enforced_payment{
                id
                title
            }
         }
    }
}
}`;

export default buildAccountingOrderForObligations;
