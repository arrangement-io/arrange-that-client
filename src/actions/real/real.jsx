import {
    SET_REAL_DATA,
    SAVE_STATE,
    ARRANGEMENT_RENAME,
    SET_UNASSIGNED_ITEMS,
    SET_CONTAINER_ITEMS
} from 'actions/actionTypes'

export const setRealData = (data) => ({
    type: SET_REAL_DATA,
    data
})

export const setUnassignedItems = (snapshotId, unassigned) => ({
    type: SET_UNASSIGNED_ITEMS,
    snapshotId,
    unassigned,
    bulk: false
})

export const bulkSetUnassignedItems = (snapshotId, unassigned) => ({
    type: SET_UNASSIGNED_ITEMS,
    snapshotId,
    unassigned,
    bulk: true,
})

export const setContainerItems = (snapshotId, containerId, items) => ({
    type: SET_CONTAINER_ITEMS,
    snapshotId,
    containerId,
    items,
    bulk: false
})

export const bulkSetContainerItems = (snapshotId, containerId, items) => ({
    type: SET_CONTAINER_ITEMS,
    snapshotId,
    containerId,
    items,
    bulk: true
})

export const saveArrangementState = (data) => ({
    type: SAVE_STATE,
    data
})

export const arrangementRename = (name) => ({
    type: ARRANGEMENT_RENAME,
    name
})