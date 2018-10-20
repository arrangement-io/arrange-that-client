import {
  EDIT_ITEM_CREATE,
  EDIT_ITEM_UPDATE,
  EDIT_ITEM_REMOVE
} from 'actions/actiontypes'

const initialState = {
}

const editItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_ITEM_CREATE:
      return action.item
    case EDIT_ITEM_UPDATE:
      return {
        ...state,
        name: action.name
      }
    case EDIT_ITEM_REMOVE:
      return {}
    default:
      return state
  }
}

export default editItemReducer