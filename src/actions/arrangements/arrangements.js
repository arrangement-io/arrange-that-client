import {
  SET_ARRANGEMENTS,
} from 'actions/actiontypes'

export const setArrangements = (arrangements) => ({
  type: SET_ARRANGEMENTS,
  arrangements
})