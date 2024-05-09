const getObligationsForAccounting = `query getObligationsForAccounting( $organization_unit_id: Int!, $type: String, $search: String) {
    getObligationsForAccounting( organization_unit_id: $organization_unit_id, type: $type, search: $search){
        message
        items {
                id
                invoice_id
                salary_id
                date
                status
                price
                title
                type
                supplier{
                    id
                    title
                }
            }
        }
    }`;

export default getObligationsForAccounting;
