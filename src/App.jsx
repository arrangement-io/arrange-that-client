import React, { Component } from 'react'
import { Provider } from 'react-redux'
import router from 'config/router'
import store from 'store/store'
import { SnackbarProvider } from 'notistack';
import axios from 'axios';
import { logout } from 'actions/account/account'

import './App.css'

class App extends Component {
    render() {
        return (
            <SnackbarProvider 
                maxSnack={3} preventDuplicate 
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Provider store={store}>
                    <div className="App">
                        { router }
                    </div>
                </Provider>
            </SnackbarProvider>
        )
    }
}

/** Intercept any unauthorized request.
* dispatch logout action accordingly **/
const UNAUTHORIZED = 401;
const INTERNAL_SERVER_ERROR = 500;
const {dispatch} = store; // direct access to redux store.
axios.interceptors.response.use(
    response => response,
    error => {
        const {status} = error.response;
        if (status === UNAUTHORIZED || status === INTERNAL_SERVER_ERROR) {
            console.log("logging out due to timeout")
            dispatch(logout());
        }
        return Promise.reject(error);
    }
);

export default App