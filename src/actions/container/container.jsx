import {
    CONTAINER_ADD,
    CONTAINER_DELETE,
    CONTAINER_EDIT,
} from 'actions/actionTypes';

export const addContainer = container => ({
    type: CONTAINER_ADD,
    container,
});

export const deleteContainer = id => ({
    type: CONTAINER_DELETE,
    id,
});

export const editContainer = container => ({
    type: CONTAINER_EDIT,
    container,
});
