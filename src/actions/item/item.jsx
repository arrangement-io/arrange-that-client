import {
    ITEM_ADD,
    ITEM_DELETE,
    ITEM_UPDATE
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

export const updateItem = (item) => ({
    type: ITEM_UPDATE,
    item: item,
    bulk: false
})

export const bulkUpdateItem = (item) => ({
    type: ITEM_UPDATE,
    item: item,
    bulk: true
})