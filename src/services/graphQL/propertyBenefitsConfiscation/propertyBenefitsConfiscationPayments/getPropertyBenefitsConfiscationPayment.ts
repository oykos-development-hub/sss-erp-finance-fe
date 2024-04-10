const getPropertyBenefitsConfiscationPayment = `query propertyBenefitConfiscationPaymentOverview($id: Int, $property_benefits_confiscation_id: Int, $page:Int, $size:Int) {
    propertyBenefitConfiscationPayment_Overview(id: $id,property_benefits_confiscation_id: $property_benefits_confiscation_id,  page:$page, size:$size) {
        message
        total
        status
        items {
            id
            property_benefits_confiscation_id
            payment_method{
                id
                title
            }
            amount
            payment_date
            payment_due_date
            receipt_number
            payment_reference_number
            debit_reference_number
            status{
                id
                title
            }
            created_at
            updated_at
        }
    }
}`;

export default getPropertyBenefitsConfiscationPayment;
