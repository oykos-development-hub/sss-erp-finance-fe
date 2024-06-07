const deleteFundRelease = `mutation($id: Int!) {
    spendingRelease_Delete(id: $id) {
        message
        status
        data
    }
}`;

export default deleteFundRelease;
