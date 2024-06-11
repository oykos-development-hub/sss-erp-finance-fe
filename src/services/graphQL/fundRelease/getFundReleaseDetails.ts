const getFundReleaseDetails = `query SpendingReleaseGet($budget_id: Int, $unit_id: Int, $month: Int!, $year: Int!) {
  spendingRelease_Get(budget_id: $budget_id, unit_id: $unit_id, month: $month, year: $year) {
    status
    message
    data
    items {
      ...SpendingReleaseFields
      children {
        ...SpendingReleaseFields
        children {
          ...SpendingReleaseFields
          children {
            ...SpendingReleaseFields
            children {
                ...SpendingReleaseFields
                children {
                    ...SpendingReleaseFields
                }
            }
          }
        }
      }
    }
  }
}

fragment SpendingReleaseFields on SpendingReleaseType {
  budget_id
  unit_id
  account_id
  account_serial_number
  account_title
  current_budget_id
  value
  month
  planned
}`;

export default getFundReleaseDetails;
