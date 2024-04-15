const insertDepositPaymentOrder = `mutation($data: DepositPaymentOrderMutation!) {
    depositPaymentOrder_Insert(data: $data) {
        status 
        message 
        data
        item {
           id
           organization_unit{
            id
            title
           }
           case_number
           supplier{
            id
            title
           }
           net_amount
           bank_account
           date_of_payment
           date_of_statement
           id_of_statement
           status
		    additional_expenses{
						    id
                title
                price
                bank_account
                subject{
                    id
                    title
                }
                account{
                    id
                    title
                }
					 }
            additional_expenses_for_paying{
						    id
                title
                price
                bank_account
                subject{
                    id
                    title
                }
                account{
                    id
                    title
                }
					 }
           created_at
           updated_at
        }
    }
}`;

export default insertDepositPaymentOrder;
