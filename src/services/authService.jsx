import Cookies from 'universal-cookie'

const ACCESS_TOKEN = 'accessToken'
const TOKEN_ID = "tokenId"
const USER = "user"

export const getAccessToken = () => {
    const cookies = new Cookies();
    return cookies.get(ACCESS_TOKEN)
}

export const getBearer = () => {
    const cookies = new Cookies();
    return cookies.get(TOKEN_ID);
}

export const getUser = () => {
    const cookies = new Cookies();
    return cookies.get(USER);
}

export const isAuthenticated = () => !!getAccessToken()

export const authenticate = (accessToken, tokenId, user) => {
    const cookies = new Cookies();      
    cookies.set(ACCESS_TOKEN, accessToken, {path: '/'})
    cookies.set(TOKEN_ID, tokenId, {path: '/'})
    cookies.set(USER, user, {path: '/'})
    return true
}

export const logout = () => {
    const cookies = new Cookies();
    cookies.remove(ACCESS_TOKEN)
    cookies.remove(TOKEN_ID)
    cookies.remove(USER)
}

export default isAuthenticated