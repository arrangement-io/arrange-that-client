import { combineReducers } from 'redux'

import real from './real';
import edititem from './edititem';

const rootReducer = combineReducers({
  real,
  edititem
});

export default rootReducer;