const getFundRelease = `query SpendingReleaseOverview($budget_id: Int, $unit_id: Int, $month:Int, $year: Int!) {
    spendingRelease_Overview(budget_id: $budget_id, unit_id: $unit_id, month: $month, year: $year) {
        status
        message
        data
        items {
					month
					year
					value
        }
    }
}`;

export default getFundRelease;
