const internalReallocationsInsert = `mutation($data: InternalReallocationMutation!) {
    internalReallocations_Insert(data: $data) {
        message
        status
        item {
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

export default internalReallocationsInsert;
