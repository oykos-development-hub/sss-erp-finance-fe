const deleteSalary = `mutation($id: Int!) {
    salary_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteSalary;
