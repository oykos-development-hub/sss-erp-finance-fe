const getFundRelease = `query SpendingReleaseOverview($budget_id: Int, $unit_id: Int, $month:Int, $year: Int!, $status: String, $hide: Boolean) {
    spendingRelease_Overview(budget_id: $budget_id, unit_id: $unit_id, month: $month, year: $year, status: $status, hide:$hide) {
        status
        message
        data
        items {
                id
                month
                year
                value
                created_at
                status
                sss_file{
                    id
                    name
                    type
                    }
                organization_unit_file{
                    id
                    name
                    type
                    }
                organization_unit{
                    id
                    title
                }

        }
    }
}`;

export default getFundRelease;
