const propertyBenefitsConfiscationOverview = `query propertyBenefitConfiscationOverview($id: Int,   $subject: String, $search: String, $property_benefits_confiscation_type_id: Int, $page:Int, $size:Int) {
    propertyBenefitConfiscation_Overview(id: $id, subject: $subject, search: $search, property_benefits_confiscation_type_id: $property_benefits_confiscation_type_id,    page:$page, size:$size) {
        message
        status
        total
        items {
            id
            property_benefits_confiscation_type{
                id
                title
            }
            decision_number
            decision_date
            subject
            jmbg
            residence
            amount
            payment_reference_number
            debit_reference_number
            account{
                id
                title
            }
            execution_date
            payment_deadline_date
            description
            status{
                id
                title
            }
            court_costs
            court_account{
                id
                title
            }
            property_benefits_confiscation_details {
              all_payments_amount 
               amount_grace_period 
               amount_grace_period_due_date
               amount_grace_period_available 
               left_to_pay_amount 
               court_costs_paid 
               court_costs_left_to_pay_amount
            }
            file{
                id
                name
                type
            }
            created_at
            updated_at
        }
    }
}`;

export default propertyBenefitsConfiscationOverview;
