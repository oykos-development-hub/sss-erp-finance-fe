const deleteExternalReallocations = `mutation($id: Int!) {
    externalReallocations_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteExternalReallocations;
