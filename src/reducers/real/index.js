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
  snapshots: [],
  unsnapshot_items: []
}

const realReducer = (state = initialState, action) => {
  switch (action.type) {
    case ITEM_ADD:
      return {
        ...state,
        items: [
          ...state.items,
          action.item
        ],
        unsnapshot_items: [
          ...state.unsnapshot_items,
          action.item
        ]
      }
    case ITEM_DELETE:
      let items = state.items
      items = items.filter(ele => ele._id !== action.id)
      return {
        ...state,
        items: items
      }
    case ITEM_RENAME:
      items = state.items
      let item = items.find(ele => ele._id === action.item._id)
      item.name = action.item.name
      items = items.filter(ele => ele._id !== action.item._id)
      return {
        ...state,
        items: [
          ...state.items,
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
      return {
        ...state,
        containers: containers
      }
    case CONTAINER_RENAME:
      containers = state.containers
      let container = containers.find(ele => ele._id === action.container._id)
      container.name = action.container.name
      containers = containers.filter(ele => ele._id !== action.containers._id)
      return {
        ...state,
        containers: [
          ...state.containers,
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