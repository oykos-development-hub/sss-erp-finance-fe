const sendBudgetOnReview = `mutation($request_id: Int!) {
    budget_SendOnReview(request_id: $request_id) {
        message
        data
        status
    }
}`;

export default sendBudgetOnReview;
