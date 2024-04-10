const deleteProceduralCostPayment = `mutation($id: Int!) {
    procedureCostPayment_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteProceduralCostPayment;
