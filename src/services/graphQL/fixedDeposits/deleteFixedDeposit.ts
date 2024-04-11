const deleteFixedDeposit = `mutation($id: Int!) {
    fixedDeposit_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteFixedDeposit;
