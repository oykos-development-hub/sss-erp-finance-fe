const rejectBudgetRequestOfficial = `mutation($request_id: Int!, $comment: String!) {
    budgetRequest_Reject(request_id: $request_id, comment: $comment) {
        message
        data
        status
    }
}`;

export default rejectBudgetRequestOfficial;
