import {
    SET_ACCOUNT,
    LOGOUT
} from 'actions/actionTypes'

export const setAccount = (account) => ({
    type: SET_ACCOUNT,
    account
})

export const logout = () => ({
    type: LOGOUT
})