const budgetSend = `mutation($id: Int!) {
    budget_Send(id: $id) {
        message
        status
    }
}`;

export default budgetSend;
