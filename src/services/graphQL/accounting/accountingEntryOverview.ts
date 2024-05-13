const accountingEntryOverview = `query accountingEntry_Overview($id: Int, $organization_unit_id: Int, $page:Int, $size:Int, $type: String) {
   accountingEntry_Overview(id: $id organization_unit_id: $organization_unit_id, page:$page, size:$size, type: $type) {
       status 
       message 
       data
       items {
           id
           organization_unit{
                   id
                   title
           }
           date_of_booking
           debit_amount
           credit_amount  
           id_of_entry
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
                date
                invoice{
                   id
                   title
                }
                salary{
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

export default accountingEntryOverview;
