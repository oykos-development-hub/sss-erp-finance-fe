const enforcedPaymentInsert = `mutation($data: EnforcedPaymentMutation!) {
    enforcedPayment_Insert(data: $data) {
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
		    amount_for_lawyer
		    amount_for_agent
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
             return_file{
                id
                name
                type
            }
            items{
                 id
                 invoice_id
                 account{
                    id
                    title
                 }
                 amount
                 title
            }
            created_at
            updated_at
        }
    }
}`;

export default enforcedPaymentInsert;
