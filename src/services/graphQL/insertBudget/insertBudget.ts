const budgetInsert = `mutation($data: BudgetMutation!) {
    budget_Insert(data: $data) {
        status 
        message 
        item {
            id
            year
            budget_type
            status
        }
    }
}`;

export default budgetInsert;
