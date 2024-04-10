const insertPropertyBenefitsConfiscationPayment = ` mutation($data: PropBenConfPaymentMutation!) {
    propertyBenefitConfiscationPayment_Insert(data: $data) {
        status 
        message 
        data
        item {
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
} `;

export default insertPropertyBenefitsConfiscationPayment;
