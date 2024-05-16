const acceptBudgetRequestOfficial = `mutation($request_id: Int!) {
    budgetRequest_Accept(request_id: $request_id) {
        message
        data
        status
    }
}`;

export default acceptBudgetRequestOfficial;
