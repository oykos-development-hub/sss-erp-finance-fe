const financialBudgetFill = `mutation($request_id: Int!, $comment: String,  $data: [FinancialBudgetFillMutation]) {
    financialBudget_Fill(request_id: $request_id, comment: $comment, data: $data) {
        status 
        message 
        data
        items {
            id
            organization_unit {
                id
                title
            }
            account {
                id
                title
            }
            request_id
            current_year
            next_year
            year_after_next
            description
        }
    }
}`;

export default financialBudgetFill;
