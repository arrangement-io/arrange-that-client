export const base_url = () => {
    if (process.env.NODE_ENV !== 'production') {
        return process.env.REACT_APP_DEV_API_HOST;
    }
    return process.env.REACT_APP_PROD_API_HOST;
};

export const ARRANGEMENT = '/arrangement';
export const EXPORT_ARRANGEMENT = '/arrangement';
export const ARRANGEMENTS = '/arrangements';
export const USERS = '/users';
export const USER_ROUTE = '/user';
