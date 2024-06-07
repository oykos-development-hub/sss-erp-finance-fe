const budgetRequestDetails = `query BudgetRequestsDetails($budget_id: Int!, $unit_id: Int!) {
    budgetRequests_Details(budget_id: $budget_id, unit_id: $unit_id) {
        status
        message
        item {
            request_id
            limit
            status {
                id
                title
            }
            budget {
                id
                title
            }
            non_financial {
                id
                request_id 
                official_comment
                status {
                    id
                    title
                }
                statement
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
                    organization_unit{
                        id
                        title
                        code
                    }
                    sub_program {
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
            financial {
                request_id
                official_comment
                current_request_id
                current_status {
                    id
                    title
                }
                current_budget_comment
                donation_request_id
                donation_status {
                    id
                    title
                }
                donation_budget_comment
                status {
                    id
                    title
                }
                current_accounts {
                    id
                    parent_id
                    title
                    serial_number
                    filled_data {
                        id
                        current_year
                        next_year
                        year_after_next
                        actual
                        description
                    }
                    children {
                        id
                        parent_id
                        title
                        serial_number
                        filled_data {
                            id
                            current_year
                            next_year
                            year_after_next
                            actual
                            description
                        }
                        children {
                            id
                            parent_id
                            title
                            serial_number
                            filled_data {
                                id
                                current_year
                                next_year
                                year_after_next
                                actual
                                description
                            }
                            children {
                                id
                                parent_id
                                title
                                serial_number
                                filled_data {
                                    id
                                    current_year
                                    next_year
                                    year_after_next
                                    actual
                                    description
                                }
                                children {
                                    id
                                    parent_id
                                    title
                                    serial_number
                                    filled_data {
                                        id
                                        current_year
                                        next_year
                                        year_after_next
                                        actual
                                        description
                                    }
                                    children {
                                        id
                                        parent_id
                                        title
                                        serial_number
                                        filled_data {
                                            id
                                            current_year
                                            next_year
                                            year_after_next
                                            actual
                                            description
                                        }
                                        children {
                                            id
                                            parent_id
                                            title
                                            serial_number
                                            filled_data {
                                                id
                                                current_year
                                                next_year
                                                year_after_next
                                                actual
                                                description
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                donation_accounts {
                    id
                    parent_id
                    title
                    serial_number
                    filled_data {
                        id
                        current_year
                        next_year
                        year_after_next
                        actual
                        description
                    }
                    children {
                        id
                        parent_id
                        title
                        serial_number
                        filled_data {
                            id
                            current_year
                            next_year
                            year_after_next
                            actual
                            description
                        }
                        children {
                            id
                            parent_id
                            title
                            serial_number
                            filled_data {
                                id
                                current_year
                                next_year
                                year_after_next
                                actual
                                description
                            }
                            children {
                                id
                                parent_id
                                title
                                serial_number
                                filled_data {
                                    id
                                    current_year
                                    next_year
                                    year_after_next
                                    actual
                                    description
                                }
                                children {
                                    id
                                    parent_id
                                    title
                                    serial_number
                                    filled_data {
                                        id
                                        current_year
                                        next_year
                                        year_after_next
                                        actual
                                        description
                                    }
                                    children {
                                        id
                                        parent_id
                                        title
                                        serial_number
                                        filled_data {
                                            id
                                            current_year
                                            next_year
                                            year_after_next
                                            actual
                                            description
                                        }
                                        children {
                                            id
                                            parent_id
                                            title
                                            serial_number
                                            filled_data {
                                                id
                                                current_year
                                                next_year
                                                year_after_next
                                                actual
                                                description
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export default budgetRequestDetails;
