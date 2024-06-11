const financialBudgetActualFill = `mutation($request_id: Int!, $data: [FinancialBudgetFillActualMutation]) {
    financialBudgetActual_Fill(request_id: $request_id, data: $data) {
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
            actual
            description
        }
    }
}`;

export default financialBudgetActualFill;
