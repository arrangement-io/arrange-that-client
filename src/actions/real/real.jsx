import {
    SET_REAL_DATA,
    SET_UNASSIGNED_ITEMS,
    SET_CONTAINER_ITEMS,
    SAVE_STATE
} from 'actions/actionTypes'

export const setRealData = (data) => ({
    type: SET_REAL_DATA,
    data
})

export const setUnassignedItems = (snapshotId, unassigned) => ({
    type: SET_UNASSIGNED_ITEMS,
    snapshotId,
    unassigned
})

export const setContainerItems = (snapshotId, containerId, items) => ({
    type: SET_CONTAINER_ITEMS,
    snapshotId,
    containerId,
    items
})

export const saveState = (data) => ({
    type: SAVE_STATE,
    data
})