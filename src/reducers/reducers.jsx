import { combineReducers } from 'redux';

import real from './real';
import account from './account';
import arrangements from './arrangements';
import exportData from './exportData';
import users from './users';
import arrangementSettings from './arrangementSettings';
import snapshotDnd from './snapshotDnd';

const rootReducer = combineReducers({
    real,
    account,
    arrangements,
    exportData,
    users,
    arrangementSettings,
    snapshotDnd,
});

export default rootReducer;
