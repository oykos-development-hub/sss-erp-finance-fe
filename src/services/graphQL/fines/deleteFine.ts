const deleteFine = `mutation($id: Int!) {
    fine_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteFine;
