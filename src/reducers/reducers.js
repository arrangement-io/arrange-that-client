import { combineReducers } from 'redux'

import real from './real/real'
import account from './account/account'
import arrangements from './arrangements/arrangements'

const rootReducer = combineReducers({
  real,
  account,
  arrangements
})

export default rootReducer