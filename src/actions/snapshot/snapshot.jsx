import {
    SNAPSHOT_ADD,
    SNAPSHOT_DELETE,
    SNAPSHOT_RENAME,
    SNAPSHOT_REPOSITION,
    CONTAINER_NOTE_DELETE,
    CONTAINER_NOTE_EDIT,
    SNAPSHOT_SET_CONTAINERS
} from 'actions/actionTypes'

export const snapshotAdd = (snapshot) => ({
    type: SNAPSHOT_ADD,
    snapshot
})

export const snapshotDelete = (snapshotId) => ({
    type: SNAPSHOT_DELETE,
    snapshotId
})

export const snapshotRename = (snapshotId, name) => ({
    type: SNAPSHOT_RENAME,
    snapshotId,
    name
})

export const snapshotReposition = (a, b) => ({
    type: SNAPSHOT_REPOSITION,
    a,
    b
})

export const deleteSnapshotContainerNote = (snapshotId, noteId) => ({
    type: CONTAINER_NOTE_DELETE,
    snapshotId,
    noteId
})

export const editSnapshotContainerNote = (snapshotId, note) => ({
    type: CONTAINER_NOTE_EDIT,
    snapshotId,
    note
})

export const snapshotSetContainers = (snapshotId, snapshotContainers) => ({
    type: SNAPSHOT_SET_CONTAINERS,
    snapshotId,
    snapshotContainers
})
