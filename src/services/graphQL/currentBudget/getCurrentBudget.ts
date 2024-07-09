const getCurrentBudget = `query currentBudget_Overview($organization_unit_id: Int!) {
    currentBudget_Overview(organization_unit_id: $organization_unit_id) {
        status
        message
        items {
            budget_id
            version
            current_accounts {
                id
                parent_id
                title
                serial_number
                filled_data {
                    budget_id
                    actual
                    balance
                    initial_actual
                    current_amount
                }
                children {
                    id
                    parent_id
                    title
                    serial_number
                    filled_data {
                        budget_id
                        actual
                        balance
                        initial_actual
                        current_amount
                    }
                    children {
                        id
                        parent_id
                        title
                        serial_number
                        filled_data {
                            budget_id
                            actual
                            balance
                            initial_actual
                            current_amount
                            }
                        }
                        children {
                            id
                            parent_id
                            title
                            serial_number
                            filled_data {
                                budget_id
                            actual
                            balance
                            initial_actual
                            current_amount
                            }
                            children {
                                id
                                parent_id
                                title
                                serial_number
                                filled_data {
                                    budget_id
                            actual
                            balance
                            initial_actual
                            current_amount
                                }
                                children {
                                    id
                                    parent_id
                                    title
                                    serial_number
                                    filled_data {
                                        budget_id
                            actual
                            balance
                            initial_actual
                            current_amount
                                    }
                                    children {
                                        id
                                        parent_id
                                        title
                                        serial_number
                                        filled_data {
                                            budget_id
                            actual
                            balance
                            initial_actual
                            current_amount
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

export default getCurrentBudget;
