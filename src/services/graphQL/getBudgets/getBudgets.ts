const budgetOverview = `query BudgetOverview($id: Int, $status: String, $year: Int, $budget_type: Int) {
    budget_Overview(id: $id, status: $status, year: $year, budget_type: $budget_type) {
        status
        message
        total
        items {
            id
            year
            budget_type
            status
        }
    }
}`;
export default budgetOverview;
