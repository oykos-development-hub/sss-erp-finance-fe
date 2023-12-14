const insertNonFinancial = `mutation($data: BudgetActivityNotFinanciallyInsertMutation!) {
    requestNotFinancially_Insert(data: $data) {
        status 
        message 
        item {
            id
            name_of_organization_unit
            organization_code
            mission_statement
            person_responsible_name_surname
            person_responsible_working_place
            person_responsible_telephone_number
            person_responsible_email
            contact_person_name_surname
            contact_person_working_place
            contact_person_telephone_number
            contact_person_email
            program {
                id
                description
                title
                code
                goals {
                    id
                    description
                    title
                }
            }
            subprogram {
                id
                description
                title
                code
                goals {
                    id
                    description
                    title
                }
            }
            activity {
                id
                description
                title
                code
                goals {
                    id
                    description
                    title
                }
            }
        }
    }
}`;
export default insertNonFinancial;
