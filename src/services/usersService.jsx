import { USERS } from 'services/serviceTypes'
import { get } from 'services/request'

export const getAllUsers = () => {
    return get({url: USERS})
}

export default getAllUsers