const getDepositPaymentOrders = `query depositPaymentOrder_Overview($id: Int,$status: String, $search: String, $organization_unit_id: Int, $page:Int, $size:Int) {
    depositPaymentOrder_Overview(id: $id, status: $status, search: $search, organization_unit_id: $organization_unit_id, page:$page, size:$size) {
        status 
        message 
        data
        items {
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
           subject_type {
            id
            title
           }
           source_bank_account
           file {
              id
              name
              type
           }
           municipality {
              id
              title
           }
           tax_authority_codebook {
              id
              title
           }
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

export default getDepositPaymentOrders;
