<<<<<<< HEAD
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import router from 'config/router';
import store from 'store/store';
=======
import React, { Component } from 'react'
import { Provider } from 'react-redux'
>>>>>>> 6cf8be1f8a943529990b6cd64d19d2f9addfb661
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
<<<<<<< HEAD
import { logout } from 'actions/account/account';
import 'handsontable/dist/handsontable.full.css';

import './App.css';
=======

import router from 'config/router'
import store from 'store/store'
import { logout } from 'actions/account/account'
import mainTheme from 'theme/mainTheme'

import 'handsontable/dist/handsontable.full.css';
import './App.css'
>>>>>>> 6cf8be1f8a943529990b6cd64d19d2f9addfb661

class App extends Component {
    render() {
        return (
<<<<<<< HEAD
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
        );
=======
            <MuiThemeProvider theme={mainTheme}>
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
            </MuiThemeProvider>
        )
>>>>>>> 6cf8be1f8a943529990b6cd64d19d2f9addfb661
    }
}

/** Intercept any unauthorized request.
* dispatch logout action accordingly * */
const UNAUTHORIZED = 401;
const INTERNAL_SERVER_ERROR = 500;
const { dispatch } = store; // direct access to redux store.
axios.interceptors.response.use(
    response => response,
    (error) => {
        const { status } = error.response;
        if (status === UNAUTHORIZED || status === INTERNAL_SERVER_ERROR) {
            console.log('logging out due to timeout');
            dispatch(logout());
        }
        return Promise.reject(error);
    },
);

export default App;
