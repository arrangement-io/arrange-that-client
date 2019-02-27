import {
    SET_ARRANGEMENTS,
} from 'actions/actionTypes'

export const setArrangements = (arrangements) => ({
    type: SET_ARRANGEMENTS,
    arrangements
})