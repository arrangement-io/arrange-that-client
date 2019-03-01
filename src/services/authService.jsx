import Cookies from 'universal-cookie'

const cookies = new Cookies();

// TODO FIX!
// Temporary fix so that we can stay authenticated
const previousToken = cookies.get('token')
const previousUser = cookies.get('user')

export const isLoggedIn = () => {
    return (previousToken === "" || previousUser === "") ? false : true
};

export default isLoggedIn