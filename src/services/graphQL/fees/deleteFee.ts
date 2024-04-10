const deleteFee = `mutation($id: Int!) {
    fee_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteFee;
