import {
    SET_ACCOUNT
} from 'actions/actionTypes'

export const setAccount = (account) => ({
    type: SET_ACCOUNT,
    account
})

export const logout = () => ({
    type: SET_ACCOUNT,
    account: {
        isAuthenticated: false,
        token: "",
        user: ""
    }
})