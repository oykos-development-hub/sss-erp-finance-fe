const rejectSSSExternalReallocations = `mutation($id: Int!) {
    externalReallocationsSSS_Reject(id: $id) {
        message
        status
    }
}`;

export default rejectSSSExternalReallocations;
