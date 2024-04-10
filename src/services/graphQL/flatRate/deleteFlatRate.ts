const deleteFlatRate = `mutation($id: Int!) {
    flatRate_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteFlatRate;
