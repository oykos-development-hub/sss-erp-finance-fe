const acceptSSSExternalReallocations = `mutation($id: Int!) {
    externalReallocationsSSS_Accept(id: $id) {
        message
        status
    }
}`;

export default acceptSSSExternalReallocations;
