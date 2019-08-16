import {
    SET_DISPLAY_NOTES
} from 'actions/actionTypes'

export const setDisplayNotes = (isDisplayNotes) => ({
    type: SET_DISPLAY_NOTES,
    isDisplayNotes
})