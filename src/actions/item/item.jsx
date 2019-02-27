import {
    ITEM_ADD,
    ITEM_DELETE,
    ITEM_RENAME
} from 'actions/actionTypes'

export const addItem = (item) => ({
    type: ITEM_ADD,
    item
})

export const deleteItem = (id) => ({
    type: ITEM_DELETE,
    id
})

export const renameItem = (item) => ({
    type: ITEM_RENAME,
    item
})