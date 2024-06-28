const getBudgetDynamicHistory = `query SpendingDynamicHistory($budget_id: Int, $unit_id: Int) {
    spendingDynamic_History(budget_id: $budget_id, unit_id: $unit_id) {
        status
        message
        data
        items {
            unit_id
            budget_id
            created_at
            username
            version
        }
    }
}`;

export default getBudgetDynamicHistory;
