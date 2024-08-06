const getActivities = `query ActivitiesOverview($id: Int, $organization_unit_id: Int, $sub_program_id: Int, $search: String) {
    activities_Overview(id: $id, organization_unit_id: $organization_unit_id, sub_program_id: $sub_program_id, search: $search) {
        status
        message
        total
        items {
            id
            title
            description
            code
            sub_program {
                id
                title
            }
            organization_unit {
                id
                title
            }
        }
    }
}`;

export default getActivities;
