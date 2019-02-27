import {
    SET_ACCOUNT
} from 'actions/actiontypes'

export const setAccount = (account) => ({
    type: SET_ACCOUNT,
    account
})