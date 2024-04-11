const deleteFixedDepositItem = `mutation($id: Int!) {
    fixedDepositItem_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteFixedDepositItem;
