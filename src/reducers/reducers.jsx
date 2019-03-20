import { combineReducers } from 'redux'

import real from './real'
import account from './account'
import arrangements from './arrangements'
import exportData from './exportData'
import users from './users'

const rootReducer = combineReducers({
    real,
    account,
    arrangements,
    exportData,
    users
})

export default rootReducer