import {
    ITEM_ADD,
    ITEM_DELETE,
    ITEM_RENAME,
    CONTAINER_ADD,
    CONTAINER_DELETE,
    CONTAINER_RENAME,
    SET_REAL_DATA,
    SET_UNASSIGNED,
    SET_SNAPSHOT,
    SAVE_STATE
} from 'actions/actiontypes'

import { post } from 'services/request'
import { EXPORT_ARRANGEMENT } from 'services/servicetypes';

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
    post({
        url: EXPORT_ARRANGEMENT,
        data: arrangement
    })
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
    case ITEM_ADD:
        const addItems = {
            ...state,
            items: [
                ...state.items,
                action.item,
            ],
            snapshots: [
                {
                    ...state.snapshots[0],
                    unassigned: [
                        ...state.snapshots[0].unassigned,
                        action.item._id
                    ]
                }
            ]
        }
        exportState(addItems)
        return addItems

    case ITEM_DELETE:
        let items = state.items
        items = items.filter(ele => ele._id !== action.id)
        let unsnapshot_items = state.snapshots[0].unassigned
        unsnapshot_items = unsnapshot_items.filter(ele => ele !== action.id)
        let snapshot = state.snapshots[0].snapshot
        for (var containerId in snapshot) {
            snapshot[containerId] = snapshot[containerId].filter(ele => ele !== action.id)
        }

        const resultItems = {
            ...state,
            items: items,
            snapshots: [{
                ...state.snapshots[0],
                snapshot: snapshot,
                unassigned: unsnapshot_items
            }]
        }
        exportState(resultItems)
        return resultItems

    case ITEM_RENAME:
        items = state.items
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

    case CONTAINER_ADD:
        const addContainers = {
            ...state,
            containers: [
                ...state.containers,
                action.container
            ]
        }
        exportState(addContainers)
        return addContainers

    case CONTAINER_DELETE:
        let containers = state.containers
        containers = containers.filter(ele => ele._id !== action.id)
        let added_unsnapshot_items = []
        snapshot = state.snapshots[0].snapshot
        let new_snapshot = {}
        for (containerId in snapshot) {
            if (containerId === action.id) {
                added_unsnapshot_items = snapshot[containerId]
            } else {
                new_snapshot[containerId] = snapshot[containerId]
            }
        }
        const resultContainers = {
            ...state,
            containers: containers,
            snapshots: [{
                ...state.snapshots[0],
                snapshot: new_snapshot,
                unassigned: [
                    ...state.snapshots[0].unassigned,
                    ...added_unsnapshot_items
                ]
            }]
        }
        exportState(resultContainers)
        return resultContainers

    case CONTAINER_RENAME:
        containers = state.containers
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

    case SET_REAL_DATA:
        exportState(action.data)
        return action.data

    case SET_UNASSIGNED:
        const unassignedResult = {
            ...state,
            snapshots: [{
                ...state.snapshots[0],
                unassigned: action.data
            }]
        }
        exportState(unassignedResult)
        return unassignedResult

    case SET_SNAPSHOT:
        snapshot = state.snapshots[0].snapshot
        new_snapshot = {}
        for (containerId in snapshot) {
            if (containerId !== action.data.id) {
                new_snapshot[containerId] = snapshot[containerId]
            }
        }
        new_snapshot[action.data.id] = action.data.items

        const result = {
            ...state,
            snapshots: [{
                ...state.snapshots[0],
                snapshot: new_snapshot
            }]
        }
        exportState(result)
        return result

    case SAVE_STATE:
        exportState(state)
        return state

    default:
        return state
    }
}

export default realReducer