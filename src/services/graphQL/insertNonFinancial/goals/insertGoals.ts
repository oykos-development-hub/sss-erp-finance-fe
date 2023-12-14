const goalsInsert = `mutation($data: GoalsNotFinanciallyInsertMutation!) {
  goalsNotFinancially_Insert(data: $data) {
    status
    message
    item {
      id
      title
      description
    }
  }
}`;

export default goalsInsert;
