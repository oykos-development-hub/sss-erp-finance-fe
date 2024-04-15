const getDepositPayments = `query depositPayment_Overview($id: Int,$status: String, $search: String, $organization_unit_id: Int, $page:Int, $size:Int) {
    depositPayment_Overview(id: $id, status: $status, search: $search, organization_unit_id: $organization_unit_id, page:$page, size:$size) {
        status 
        message 
        data
        items {
           id
            title
            payer
            case_number
            party_name
            number_of_bank_statement
            date_of_bank_statement
            current_bank_account
            status
            account{
                id
                title
            }
            organization_unit{
                id
                title
            }
            file {
                id
                name 
                type
            }
            amount
            main_bank_account
            date_of_transfer_main_account
            created_at
            updated_at   
        }
        }
    }`;

export default getDepositPayments;
