import {
  SET_ACCOUNT
} from 'actions/actiontypes'

const initialState = {
  isAuthenticated: false,
  user: null,
  token: ''
}

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT:
      return action.account
    default:
      return state
  }
}

export default accountReducer