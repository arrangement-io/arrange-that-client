import { USERS } from 'services/serviceTypes'
import { getAuthenticated } from 'services/request'

export const getAllUsers = () => {
    return getAuthenticated({url: USERS})
}

export default getAllUsers