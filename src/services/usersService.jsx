import { USERS } from 'services/serviceTypes';
import { getAuthenticated } from 'services/request';

export const getAllUsers = () => getAuthenticated({ url: USERS });

export default getAllUsers;
