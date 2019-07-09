import {
    ITEM_ADD,
    ITEM_DELETE,
    ITEM_RENAME
} from 'actions/actionTypes'

export const addItem = (item) => ({
    type: ITEM_ADD,
    item: item,
    bulk: false
})

export const bulkAddItem = (item) => ({
    type: ITEM_ADD,
    item: item,
    bulk: true
})

export const deleteItem = (id) => ({
    type: ITEM_DELETE,
    id: id
})

export const bulkDeleteItem = (id) => ({
    type: ITEM_DELETE,
    id: id,
    bulk: true
})

export const renameItem = (item) => ({
    type: ITEM_RENAME,
    item: item,
    bulk: false
})

export const bulkRenameItem = (item) => ({
    type: ITEM_RENAME,
    item: item,
    bulk: true
})