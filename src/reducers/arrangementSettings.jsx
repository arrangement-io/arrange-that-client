import {
    SET_DISPLAY_NOTES,
} from 'actions/actionTypes';

const initialState = {
    isDisplayNotes: true,
};

const arrangementSettingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DISPLAY_NOTES:
            return { ...state, isDisplayNotes: action.isDisplayNotes };
        default:
            return state;
    }
};

export default arrangementSettingsReducer;
