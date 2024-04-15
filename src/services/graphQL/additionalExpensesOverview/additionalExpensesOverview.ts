const additionalExpensesOverview = `query additionalExpensesOverview($id: Int, $year: Int, $subject_id: Int, $status: String, $search: String, $organization_unit_id: Int, $page:Int, $size:Int) {
    additionalExpenses_Overview(id: $id, status: $status, year: $year, subject_id: $subject_id, search: $search, organization_unit_id: $organization_unit_id, page:$page, size:$size) {
        message
        total
        items {
                id
                title
                price
                bank_account
                subject{
                    id
                    title
                }
                account{
                    id
                    title
                }
                status
            }
        }
    }`;

export default additionalExpensesOverview;
