const nonFinancialBudgetFill = `mutation($data: NonFinancialBudgetInsertMutation!) {
    nonFinancialBudget_Insert(data: $data) {
        status 
        message 
        item {
            id
            request_id
            status {
                id
                title
            }
            impl_contact_fullname
            impl_contact_working_place
            impl_contact_phone
            impl_contact_email
            contact_fullname
            contact_working_place
            contact_phone
            contact_email
            activity {
                id
                description
                title
                code
                sub_program {
                    id
                    title
                }
                organization_unit {
                    id
                    title
                }
                goals {
                    id
                    title
                    description
                    indicators {
                        id
                        performance_indicator_code
                        indicator_source
                        base_year
                        gender_equality
                        base_value
                        source_of_information
                        unit_of_measure
                        indicator_description
                        planned_value_1
                        revised_value_1
                        achieved_value_1
                        planned_value_2
                        revised_value_2
                        achieved_value_2
                        planned_value_3
                        revised_value_3
                        achieved_value_3
                    }
                }
            }                
        }
    }
}`;

export default nonFinancialBudgetFill;
