import { combineReducers } from 'redux'

import real from './real/real'
import account from './account/account'
import arrangements from './arrangements/arrangements'
import exportData from './exportData/exportData'

const rootReducer = combineReducers({
  real,
  account,
  arrangements,
  exportData,
})

export default rootReducer