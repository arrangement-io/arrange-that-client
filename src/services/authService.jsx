import Cookies from 'universal-cookie'

export const isLoggedIn = () => {
    const cookies = new Cookies();
    // TODO FIX!
    // Temporary fix so that we can stay authenticated
    const previousToken = cookies.get('token')
    const previousUser = cookies.get('user')

    return (previousToken === "" || previousUser === "" || previousToken === undefined || previousUser === undefined) ? false : true
};

export default isLoggedIn