import {
  ITEM_ADD,
  ITEM_DELETE,
  ITEM_RENAME,
  CONTAINER_ADD,
  CONTAINER_DELETE,
  CONTAINER_RENAME,
  SET_REAL_DATA
} from 'actions/actiontypes'

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

const realReducer = (state = initialState, action) => {
  switch (action.type) {
    case ITEM_ADD:
      return {
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
    case ITEM_DELETE:
      let items = state.items
      items = items.filter(ele => ele._id !== action.id)
      let unsnapshot_items = state.snapshots[0].unassigned
      unsnapshot_items = unsnapshot_items.filter(ele => ele !== action.id)
      let snapshot = state.snapshots[0].snapshot
      for (var containerId in snapshot) {
        snapshot[containerId] = snapshot[containerId].filter(ele => ele !== action.id)
      }

      return {
        ...state,
        items: items,
        snapshots: [{
          ...state.snapshots[0],
          snapshot: snapshot,
          unassigned: unsnapshot_items
        }]
      }
    case ITEM_RENAME:
      items = state.items
      let item = items.find(ele => ele._id === action.item._id)
      item.name = action.item.name
      items = items.filter(ele => ele._id !== action.item._id)

      return {
        ...state,
        items: [
          ...items,
          item
        ]
      }
    case CONTAINER_ADD:
      return {
        ...state,
        containers: [
          ...state.containers,
          action.container
        ]
      }
    case CONTAINER_DELETE:
      let containers = state.containers
      containers = containers.filter(ele => ele._id !== action.id)
      let added_unsnapshot_items
      snapshot = state.snapshots[0].snapshot
      let new_snapshot
      for (var containerId in snapshot) {
        if (containerId === action.id) {
          added_unsnapshot_items = snapshot[containerId]
        } else {
          new_snapshot[containerId] = snapshot[containerId]
        }
      }

      return {
        ...state,
        containers: containers,
        snapshots: [{
          ...state.snapshots[0],
          snapshot: new_snapshot,
          unassigned: [
            ...state.snapshots[0].unassigned,
            added_unsnapshot_items
          ]
        }]
      }
    case CONTAINER_RENAME:
      containers = state.containers
      let container = containers.find(ele => ele._id === action.container._id)
      container.name = action.container.name
      containers = containers.filter(ele => ele._id !== action.containers._id)
      return {
        ...state,
        containers: [
          ...containers,
          container
        ]
      }
    case SET_REAL_DATA:
      return action.data
    default:
      return state
  }
}

export default realReducer