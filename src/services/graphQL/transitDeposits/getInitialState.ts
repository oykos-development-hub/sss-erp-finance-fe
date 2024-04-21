const getInitialState = `
query getInitialState_Overview($transitional_bank_account: Boolean,$bank_account: String, $date: String!, $organization_unit_id: Int!) {
    getInitialState_Overview(transitional_bank_account: $transitional_bank_account, bank_account: $bank_account, date: $date, organization_unit_id: $organization_unit_id) {
        status 
        message 
        data
        items {
          current_bank_account
          amount
        }
        }
    }
`;

export default getInitialState;
