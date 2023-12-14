const budgetDetails = `query BudgetDetails($id: Int!) {
          budget_Details(id: $id) {
            message
            status
            items {
              step
              status
            }
        }
    }`;
export default budgetDetails;
