const deleteDepositDispatch = `mutation($id: Int!) {
    fixedDepositDispatch_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteDepositDispatch;
