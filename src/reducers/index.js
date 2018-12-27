import { combineReducers } from 'redux'

import real from './real'
import account from './account'
import arrangements from './arrangements'

const rootReducer = combineReducers({
  real,
  account,
  arrangements
})

export default rootReducer