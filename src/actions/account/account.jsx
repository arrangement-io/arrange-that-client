import {
    SET_ACCOUNT
} from 'actions/actionTypes'

export const setAccount = (account) => ({
    type: SET_ACCOUNT,
    account
})