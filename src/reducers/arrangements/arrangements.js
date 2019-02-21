import {
  SET_ARRANGEMENTS
} from 'actions/actiontypes'

const initialState = []

const arrangementsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ARRANGEMENTS:
      return action.arrangements
    default:
      return state
  }
}

export default arrangementsReducer