const obligationsOverview = `query obligations_Overview($supplier_id: Int!, $type: String, $organization_unit_id: Int!) {
    obligations_Overview(supplier_id: $supplier_id, type: $type, organization_unit_id: $organization_unit_id){
        message
        items {
                invoice_id
                 additional_expense_id
                 salary_additional_expense_id
                 status
                 total_price
                 remain_price
                 title
                 type
                 invoice_items{
                    account{
                        id
                        title
                    }
                    id
                    title
                    total_price
                    remain_price
                 }
            }
        }
    }`;

export default obligationsOverview;
