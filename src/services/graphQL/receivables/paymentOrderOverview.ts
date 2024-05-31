const paymentOrderOverview = `query paymentOrder_Overview($id: Int,$status: String, $search: String, $organization_unit_id: Int, $page:Int, $size:Int, $year: Int, $supplier_id: Int) {
    paymentOrder_Overview(id: $id, status: $status, search: $search, organization_unit_id: $organization_unit_id, page:$page, size:$size, year: $year, supplier_id: $supplier_id) {
        status 
        message 
        data
        total
        items {
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
            registred
            date_of_payment
            date_of_sap
            date_of_order 
            description
            id_of_statement
            sap_id
            status
            source_of_funding
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

export default paymentOrderOverview;
