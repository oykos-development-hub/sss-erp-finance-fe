const accountingEntryInsert = `mutation($data: AccountingEntryMutation!) {
    accountingEntry_Insert(data: $data) {
        status 
        message 
        data
        item {
            id
            organization_unit{
                    id
                    title
            }
            date_of_booking
            debit_amount
            credit_amount  
            items{
                 id
                 title
                 account{
                    id
                    title
                 }
                 debit_amount
                 credit_amount  
                 title
                 type
                 invoice{
                    id
                    title
                 }
                 salary{
                    id
                    title
                 }
            }
        }
    }
}`;

export default accountingEntryInsert;
