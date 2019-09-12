import {
    SET_TSV_EXPORT,
} from 'actions/actionTypes';

const initialState = {
    TSV: '',
    CSV: '',
};

const exportTSVDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TSV_EXPORT:
            const TSVExportDataState = {
                ...state,
                TSV: action.data,
            };
            return TSVExportDataState;
        default:
            return state;
    }
};

export default exportTSVDataReducer;
