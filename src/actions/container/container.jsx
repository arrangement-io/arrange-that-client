import {
    CONTAINER_ADD,
    CONTAINER_DELETE,
    CONTAINER_RENAME
} from 'actions/actiontypes'

export const addContainer = (container) => ({
    type: CONTAINER_ADD,
    container
})

export const deleteContainer = (id) => ({
    type: CONTAINER_DELETE,
    id
})

export const renameContainer = (container) => ({
    type: CONTAINER_RENAME,
    container
})