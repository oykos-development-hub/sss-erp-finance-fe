const budgetOverview = `query BudgetOverview($id: Int, $status: Int, $year: Int, $budget_type: Int) {
    budget_Overview(id: $id, status: $status, year: $year, budget_type: $budget_type) {
        status
        message
        total
        items {
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
            number_of_requests
        }
    }
}`;
export default budgetOverview;
