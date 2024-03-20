const updateContoVersionMutation = `mutation($budget_id: Int!) {
    financialBudgetVersion_Update(budget_id: $budget_id) {
        status 
        message 
        item {
            version
            latest_version
            accounts {
                id
                parent_id
                title
                serial_number
                children {
                    id
                    parent_id
                    title
                    serial_number
                    children {
                        id
                        parent_id
                        title
                        serial_number
                        children {
                            id
                            parent_id
                            title
                            serial_number
                            children {
                                id
                                parent_id
                                title
                                serial_number
                                children {
                                    id
                                    parent_id
                                    title
                                    serial_number
                                    children {
                                        id
                                        parent_id
                                        title
                                        serial_number
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

export default updateContoVersionMutation;
