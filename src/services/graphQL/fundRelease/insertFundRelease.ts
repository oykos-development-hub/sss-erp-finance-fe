const insertFundRelease = `mutation($data: [SpendingReleaseMutation]) {
    spendingRelease_Insert(data: $data) {
        status 
        message 
        data
        items {
            id
            budget_id
            current_budget_id
            unit_id
            account_id
            value
            month
            year
        }
    }
}`;

export default insertFundRelease;
