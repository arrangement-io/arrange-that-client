import {
    SET_ACCOUNT
} from 'actions/actionTypes'
import Cookies from 'universal-cookie'

const cookies = new Cookies();

// TODO FIX!
// Temporary fix so that we can stay authenticated
const previousToken = cookies.get('token')
const previousUser = cookies.get('user')

const initialState = {
    isAuthenticated: (previousToken === "" 
        || previousToken === undefined 
        || previousUser === "" 
        || previousUser === undefined) ? false : true,
    user: previousUser,
    token: previousToken
}

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACCOUNT:
            cookies.set('token', action.account.token, {path: '/'})
            cookies.set('user', action.account.user, {path: '/'})
            return action.account
        default:
            return state
    }
}

export default accountReducer