const getCases = `query depositCaseNumbers_Overview($organization_unit_id: Int!, $bank_account: String!) {
    depositCaseNumbers_Overview(organization_unit_id: $organization_unit_id, bank_account: $bank_account) {
        status 
        message 
        data
        items {
            case_number
            amount
        }
    }
}`;

export default getCases;
