const deleteFundRelease = `mutation($unit_id: Int) {
    spendingRelease_Delete(unit_id: $unit_id) {
        message
        status
        data
    }
}`;

export default deleteFundRelease;
