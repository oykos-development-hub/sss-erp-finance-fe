const getOverviewBudgetRequestOfficial = `query OfficialBudgetRequestOverview($budget_id: Int!) {
    officialBudgetRequests_Overview(budget_id: $budget_id) {
        status
        message
        total
        items {
            unit {
                id
                title
            }
            status
            receive_date
            total
        }
    }
}`;

export default getOverviewBudgetRequestOfficial;
