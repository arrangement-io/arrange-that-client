import { SET_USERS } from 'actions/actionTypes'

const initialState = []

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS: {
            return action.users
        }
        default: {
            return state
        }
    }
}

export default usersReducer