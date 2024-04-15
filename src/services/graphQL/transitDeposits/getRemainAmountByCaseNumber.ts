const getRemainAmoutByCaseNumber = `query depositPaymentCaseNumber_Overview($case_number: String!) {
    depositPaymentCaseNumber_Overview(case_number: $case_number) {
        status 
        message 
        data
        item {
            amount
        }
    }
}`;

export default getRemainAmoutByCaseNumber;
