const deleteProceduralCost = `mutation($id: Int!) {
    procedureCost_Delete(id: $id) {
        message
        status
    }
}`;

export default deleteProceduralCost;
