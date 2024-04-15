const getAdditionalExpenses = `query depositPaymentAdditionalExpensesOverview($id: Int, $year: Int, $subject_id: Int, $status: String, $search: String, $organization_unit_id: Int, $page:Int, $size:Int) {
    depositPaymentAdditionalExpenses_Overview(id: $id, status: $status, year: $year, subject_id: $subject_id, search: $search, organization_unit_id: $organization_unit_id, page:$page, size:$size) {
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
            }
        }
    }`;

export default getAdditionalExpenses;
