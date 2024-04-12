const deleteWill = `mutation($id: Int!) {
    fixedDepositWill_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteWill;
