const calculateAdditionalExpenses = `query calculateAdditionalExpenses($tax_authority_codebook_id: Int!, $municipality_id: Int!, $net_price: Float, $gross_price: Float, $previous_income_net: Float, $previous_income_gross: Float) {
    calculateAdditionalExpenses(tax_authority_codebook_id: $tax_authority_codebook_id, municipality_id:$municipality_id, net_price: $net_price, gross_price: $gross_price, previous_income_net: $previous_income_net, previous_income_gross: $previous_income_gross) {
        message
        total
        items {
            title
            subject{
                id
                title
            }
            organization_unit{
                id
                title
            }
            status
            price
        }
    }
}`;

export default calculateAdditionalExpenses;
