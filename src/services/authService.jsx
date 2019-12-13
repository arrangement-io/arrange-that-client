import Cookies from 'universal-cookie';
import { postAuthenticated, getAuthenticated } from 'services/request';
import { USER_ROUTE } from 'services/serviceTypes';

const ACCESS_TOKEN = 'accessToken';
const TOKEN_ID = 'tokenId';
const USER = 'user';

export const getAccessToken = () => {
    const cookies = new Cookies();
    return cookies.get(ACCESS_TOKEN);
};

export const getBearer = () => {
    const cookies = new Cookies();
    return cookies.get(TOKEN_ID);
};

export const getUser = () => {
    const cookies = new Cookies();
    return cookies.get(USER);
};

export const fetchUser = () => getAuthenticated({ url: USER_ROUTE });

export const isAuthenticated = () => !!getAccessToken();

export const authenticate = (accessToken, tokenId, user) => {
    const cookies = new Cookies();
    cookies.set(ACCESS_TOKEN, accessToken, { path: '/' });
    cookies.set(TOKEN_ID, tokenId, { path: '/' });
    cookies.set(USER, user, { path: '/' });
    return true;
};

export const logout = () => {
    postAuthenticated({ url: '/logout' })
        .then((response) => {
            console.log(response);
            Promise.resolve();
        })
        .catch((err) => {
            console.log(err);
            Promise.reject(err);
        });

    const cookies = new Cookies();
    cookies.remove(ACCESS_TOKEN, { path: '/' });
    cookies.remove(TOKEN_ID, { path: '/' });
    cookies.remove(USER, { path: '/' });
};

export default isAuthenticated;
