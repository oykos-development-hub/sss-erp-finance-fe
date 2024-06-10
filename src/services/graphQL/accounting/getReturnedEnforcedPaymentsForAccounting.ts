const getReturnedEnforcedPaymentsForAccounting = `query getReturnedEnforcedPaymentsForAccounting( $organization_unit_id: Int!, $search: String, $date_of_start: String, $date_of_end: String) {
    getReturnedEnforcedPaymentsForAccounting( organization_unit_id: $organization_unit_id, search: $search, date_of_start: $date_of_start, date_of_end: $date_of_end){
        message
        items {
                id
                payment_order_id
                date
                price
                title
                supplier{
                    id
                    title
                }
            }
        }
    }`;

export default getReturnedEnforcedPaymentsForAccounting;
