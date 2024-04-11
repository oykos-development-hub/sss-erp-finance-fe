const insertFixedDepositItem = `mutation($data: FixedDepositItemMutation!) {
    fixedDepositItem_Insert(data: $data) {
        status 
        message 
        data
    }
}`;

export default insertFixedDepositItem;
