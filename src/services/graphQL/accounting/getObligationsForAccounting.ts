const getObligationsForAccounting = `query getObligationsForAccounting( $organization_unit_id: Int!, $type: String, $search: String, $date_of_start: String, $date_of_end: String) {
    getObligationsForAccounting( organization_unit_id: $organization_unit_id, type: $type, search: $search, date_of_start: $date_of_start, date_of_end: $date_of_end){
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
