const deleteAccountingEntry = `mutation($id: Int!) {
    accountingEntry_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteAccountingEntry;
