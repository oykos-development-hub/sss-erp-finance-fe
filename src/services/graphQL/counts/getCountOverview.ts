const getCountOverview = `query AccountOverview($id: Int, $tree: Boolean, $search: String, $page: Int, $level: Int,$size: Int, $version: Int) {
    account_Overview(id: $id, tree: $tree, search: $search, page: $page, size: $size, level: $level, version: $version) {
        status
        message
        total
        version
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
