const acceptBySSSFundRelease = `mutation($id: Int!, $file_id: Int!) {
    spendingReleaseAcceptSSS(id: $id, file_id: $file_id) {
        message
        status
    }
}`;

export default acceptBySSSFundRelease;
