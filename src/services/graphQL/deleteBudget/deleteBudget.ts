const budgetDelete = `mutation($id: Int!) {
  budget_Delete(id: $id) {
        message
        status
    }}`;

export default budgetDelete;
