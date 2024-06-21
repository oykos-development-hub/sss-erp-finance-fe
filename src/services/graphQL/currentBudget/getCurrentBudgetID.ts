const getCurrentBudgetID = `query currentBudget_Overview($organization_unit_id: Int!) {
    currentBudget_Overview(organization_unit_id: $organization_unit_id) {
        status
        message
        items {
            budget_id
            version
            }
        }
    }`;

export default getCurrentBudgetID;
