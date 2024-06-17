const internalReallocationsOverview = `query internalReallocations_Overview($id: Int, $page: Int, $size: Int, $organization_unit_id:Int, $year: Int, $requested_by: Int, $budget_id: Int) {
    internalReallocations_Overview(id: $id, page: $page, size: $size, organization_unit_id: $organization_unit_id, year: $year, requested_by: $requested_by, budget_id: $budget_id) {
        message
        status
        items {
            id
            title
            organization_unit{
                id
                title
            }   
            date_of_request
            requested_by{
                id
                title
            }
            budget{
                id
                title
            }
            file{
                id
                name 
                type
            }
            items{
                id
                source_account{
                    id
                    title
                }
                destination_account{
                    id
                    title
                }
                amount
            }
        }
    }
}`;

export default internalReallocationsOverview;
