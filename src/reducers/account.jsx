import { SET_ACCOUNT, LOGOUT } from 'actions/actionTypes'
import Cookies from 'universal-cookie'
import { authenticate, logout, getUser, getAccessToken } from 'services/authService'


const previousUser = getUser()
const previousToken = getAccessToken()

const initialState = {
    user: previousUser,
    token: previousToken
}

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACCOUNT:
            authenticate(
                action.account.token, 
                action.account.tokenId,
                action.account.user);
            return action.account
        case LOGOUT:
            logout()
            return {
                user: "",
                token: ""
            }
        default:
            return state
    }
}

export default accountReducer