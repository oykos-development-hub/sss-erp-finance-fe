const budgetInsert = `mutation($data: BudgetMutation!) {
    budget_Insert(data: $data) {
        status 
        message 
        data
        item {
            id
            year
            budget_type
            status
            limits {
                id
                organization_unit_id
                limit
            }
        }
    }
}`;

export default budgetInsert;
