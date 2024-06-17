const internalReallocationsDelete = `
mutation($id: Int!) {
    internalReallocations_Delete(id: $id) {
        message
        status
    }
}`;

export default internalReallocationsDelete;
