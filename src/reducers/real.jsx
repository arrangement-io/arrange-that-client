import {
    ITEM_ADD,
    ITEM_DELETE,
    ITEM_RENAME,
    CONTAINER_ADD,
    CONTAINER_DELETE,
    CONTAINER_RENAME,
    SET_REAL_DATA,
    ARRANGEMENT_RENAME,
    SET_UNASSIGNED_ITEMS,
    SET_CONTAINER_ITEMS,
    SAVE_STATE,
    SNAPSHOT_ADD,
    SNAPSHOT_DELETE,
    SNAPSHOT_RENAME
} from 'actions/actionTypes'

import { updateArrangement } from 'services/arrangementService'
import { getSnapshotIndex, getSnapshotContainerIndex } from 'utils'

const initialState = {
    _id: '',
    name: '',
    items: [],
    modified_timestamp: '',
    containers: [],
    is_deleted: false,
    timestamp: '',
    snapshots: []
}

function exportState (real) {
    var d = new Date()
    var seconds = d.getTime() / 1000
    let arrangement = {
        ...real,
        modified_timestamp: seconds
    }
    // Test arrangement based on json validation
    updateArrangement(arrangement)
        .then(response => {
            console.log(response.data)
            Promise.resolve()
        })
        .catch(err => {
            console.log(err)
            Promise.reject(err)
        })
}

const realReducer = (state = initialState, action) => {
    switch (action.type) {
    case ITEM_ADD: {
        // Add item to global item list
        const addItemState = {
            ...state,
            items: [
                ...state.items,
                action.item,
            ]
        }

        // Add item to all snapshot unassigned
        for (let snapshot of addItemState.snapshots) {
            snapshot.unassigned.push(action.item._id)
        }
        exportState(addItemState)
        return addItemState
    }
                
    case ITEM_DELETE: {
        const deleteItemState = {
            ...state
        }

        // Remove item from global items list
        deleteItemState.items = deleteItemState.items.filter(ele => ele._id !== action.id)

        // Remove item from all snapshots
        for (let snapshot of deleteItemState.snapshots) {
            // Remove item from all containers in snapshot
            for (let container of snapshot.snapshotContainers) {
                container = container.items.filter(ele => ele !== action.id)
            }
            // Remove item from unassigned in snapshot
            snapshot.unassigned = snapshot.unassigned.filter(ele => ele !== action.id)
        }
        exportState(deleteItemState)
        return deleteItemState
    }

    case ITEM_RENAME: {
        let items = state.items
        let item = items.find(ele => ele._id === action.item._id)
        item.name = action.item.name
        items = items.filter(ele => ele._id !== action.item._id)
        const resultItemRename = {
            ...state,
            items: [
                ...items,
                item
            ]
        }
        exportState(resultItemRename)
        return resultItemRename
    }

    case CONTAINER_ADD: {
        // Add container to global
        const addContainerState = {
            ...state,
            containers: [
                ...state.containers,
                action.container
            ]
        }
        
        // Add container to all snapshots
        for (let snapshot of addContainerState.snapshots) {
            snapshot.snapshotContainers.push({_id: action.container._id, items: []})
        }

        exportState(addContainerState)
        return addContainerState
    }

    case CONTAINER_DELETE: {
        const deleteContainerState = {
            ...state
        }
        // Remove container from global
        deleteContainerState.containers = deleteContainerState.containers.filter(ele => ele._id !== action.id)

        // Delete container to all snapshots
        for (let snapshot of deleteContainerState.snapshots) {
            const containerIndex = getSnapshotContainerIndex(snapshot, action.id)
            for (let item of snapshot.snapshotContainers[containerIndex].items) {
                snapshot.unassigned.push(item)
            }
            snapshot.snapshotContainers.splice(containerIndex, 1)
        }
        exportState(deleteContainerState)
        return deleteContainerState
    }
            
    case CONTAINER_RENAME: {
        let containers = state.containers
        let container = containers.find(ele => ele._id === action.container._id)
        container.name = action.container.name
        containers = containers.filter(ele => ele._id !== action.containers._id)
        
        const resultContainerRename = {
            ...state,
            containers: [
                ...containers,
                container
            ]
        }
        exportState(resultContainerRename)
        return resultContainerRename
    }

    case SET_REAL_DATA: {
        exportState(action.data)
        return action.data
    }
        

    case SET_UNASSIGNED_ITEMS: {
        const setUnassignedState = {
            ...state
        }
        const index = getSnapshotIndex(setUnassignedState, action.snapshotId)
        setUnassignedState.snapshots[index].unassigned = action.unassigned
            
        exportState(setUnassignedState)
        return setUnassignedState
    }

    case SET_CONTAINER_ITEMS: {
        const setContainerItemsState = {
            ...state
        }
        const index = getSnapshotIndex(setContainerItemsState, action.snapshotId)
        const containerIndex = getSnapshotContainerIndex(setContainerItemsState.snapshots[index], action.containerId)
        setContainerItemsState.snapshots[index].snapshotContainers[containerIndex].items = action.items

        exportState(setContainerItemsState)
        return setContainerItemsState
    }

    case SAVE_STATE: {
        exportState(state)
        return state
    }
            
    case SNAPSHOT_ADD: {
        const snapshotAddState = {
            ...state
        }
        snapshotAddState.snapshots.push(action.snapshot)
        exportState(snapshotAddState)
        return snapshotAddState
    }

    case SNAPSHOT_DELETE: {
        const snapshotDeleteState = {
            ...state
        }

        const index = getSnapshotIndex(snapshotDeleteState, action.snapshotId)
        snapshotDeleteState.snapshots.splice(index, 1)
        exportState(snapshotDeleteState)
        return snapshotDeleteState
    }

    case ARRANGEMENT_RENAME:
        const arrangementRenameState = {
            ...state,
            name: action.name
        }
        exportState(arrangementRenameState)
        return arrangementRenameState


    case SNAPSHOT_RENAME: {
        const snapshotRenameState = {
            ...state
        }

        const index = getSnapshotIndex(snapshotRenameState, action.snapshotId)
        snapshotRenameState.snapshots[index].name = action.name
        exportState(snapshotRenameState)
        return snapshotRenameState
    }

    default: {
        return state
    }
    }
}

export default realReducer