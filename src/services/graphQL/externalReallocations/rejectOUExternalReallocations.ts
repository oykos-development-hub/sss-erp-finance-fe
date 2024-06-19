const rejectOUExternalReallocations = `mutation($id: Int!) {
    externalReallocationsOU_Reject(id: $id) {
        message
        status
    }
}`;

export default rejectOUExternalReallocations;
