const budgetInsert = `mutation($data: BudgetMutation!) {
    budget_Insert(data: $data) {
        status 
        message 
        items {
            id
            year
            source
            type
            status
        }
    }
}`;

export default budgetInsert;
