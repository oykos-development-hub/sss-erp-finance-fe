const getCountOverview = `query AccountOverview($id: Int, $tree: Boolean, $search: String, $page: Int, $level: Int,$size: Int, $version: Int, $leaf: Boolean) {
    account_Overview(id: $id, tree: $tree, search: $search, page: $page, size: $size, level: $level, version: $version, leaf: $leaf) {
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
