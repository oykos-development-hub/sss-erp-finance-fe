const budgetOverview = `query BudgetOverview($page: Int, $size: Int, $id: Int, $status: String, $year: String, $type_budget: String) {
    budget_Overview(page: $page, size: $size,id: $id, status: $status, year: $year, type_budget: $type_budget) {
        status
        message
        total
        items {
            id
            year
            source
            type
            status
        }
    }
}`;
export default budgetOverview;
