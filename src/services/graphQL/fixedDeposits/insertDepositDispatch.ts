const insertDepositDispatch = `mutation($data: FixedDepositDispatchMutation!) {
    fixedDepositDispatch_Insert(data: $data) {
        status 
        message 
        data
    }
}`;

export default insertDepositDispatch;
