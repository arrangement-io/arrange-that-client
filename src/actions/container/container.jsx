import {
    CONTAINER_ADD,
    CONTAINER_DELETE,
    CONTAINER_EDIT,
    CONTAINER_NOTE_ADD,
    CONTAINER_NOTE_DELETE,
    CONTAINER_NOTE_EDIT,
} from 'actions/actionTypes'

export const addContainer = (container) => ({
    type: CONTAINER_ADD,
    container
})

export const deleteContainer = (id) => ({
    type: CONTAINER_DELETE,
    id
})

export const editContainer = (container) => ({
    type: CONTAINER_EDIT,
    container
})

export const addContainerNote = (note) => ({
    type: CONTAINER_NOTE_ADD,
    note
})

export const deleteContainerNote = (snapshot) => ({
    type: CONTAINER_NOTE_DELETE,
    snapshot
})

export const editContainerNote = (snapshot) => ({
    type: CONTAINER_NOTE_EDIT,
    snapshot
})