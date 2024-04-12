const deleteWillDispatch = `mutation($id: Int!) {
    fixedDepositWillDispatch_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteWillDispatch;
