const budgetInsert = `mutation($data: BudgetMutation!) {
    budget_Insert(data: $data) {
        status 
        message 
        data
        item {
            id
            year
            budget_type
            status {
              id
              title
            }
            limits {
                id
                organization_unit_id
                limit
            }
        }
    }
}`;

export default budgetInsert;
