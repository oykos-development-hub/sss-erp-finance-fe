const insertDepositPayment = `mutation($data: DepositPaymentMutation!) {
    depositPayment_Insert(data: $data) {
        status 
        message 
        data
        item {
            id
            payer
            case_number
            party_name
            number_of_bank_statement
            date_of_bank_statement
            account{
                id
                title
            }
            organization_unit{
                id
                title
            }
            amount
            main_bank_account
            date_of_transfer_main_account
            created_at
            updated_at 
        }
    }
}`;

export default insertDepositPayment;
