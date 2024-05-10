const getEnforcedPaymentsForAccounting = `query getEnforcedPaymentsForAccounting( $organization_unit_id: Int!, $search: String) {
    getEnforcedPaymentsForAccounting( organization_unit_id: $organization_unit_id, search: $search){
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

export default getEnforcedPaymentsForAccounting;
