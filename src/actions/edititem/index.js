import {
  EDIT_ITEM_CREATE,
  EDIT_ITEM_UPDATE,
  EDIT_ITEM_REMOVE
} from 'actions/actiontypes'

export const createEditItem = (item) => ({
  type: EDIT_ITEM_CREATE,
  item
})

export const updateEditItem = (name) => ({
  type: EDIT_ITEM_UPDATE,
  name
})

export const removeEditItem = () => ({
  type: EDIT_ITEM_REMOVE
})