import {
    SNAPSHOT_ADD,
    SNAPSHOT_DELETE,
    SNAPSHOT_RENAME,
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
