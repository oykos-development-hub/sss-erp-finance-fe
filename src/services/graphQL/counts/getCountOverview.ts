const getCountOverview = `query($id: Int!, $tree: Boolean!) {
    account_Overview(id: $id, tree: $tree) {
        status
        message
        total
        items {
            id
            parent_id
            title
            serial_number
            children {
                id
                parent_id
                title
                serial_number
                children {
                    id
                    parent_id
                    title
                    serial_number
                    children {
                        id
                        parent_id
                        title
                        serial_number
                        children {
                            id
                            parent_id
                            title
                            serial_number
                            children {
                                id
                                parent_id
                                title
                                serial_number
                                children {
                                    id
                                    parent_id
                                    title
                                    serial_number
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export default getCountOverview;
