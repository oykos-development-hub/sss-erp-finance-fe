const inserWillDispatch = `mutation($data: FixedDepositWillDispatchMutation!) {
    fixedDepositWillDispatch_Insert(data: $data) {
        status 
        message 
        data
    }
}`;

export default inserWillDispatch;
