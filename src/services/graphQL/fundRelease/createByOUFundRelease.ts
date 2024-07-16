const createByOUFundRelease = `mutation($file_id: Int!) {
    spendingReleaseRequest_Insert(file_id: $file_id) {
        message
        status
    }
}`;

export default createByOUFundRelease;
