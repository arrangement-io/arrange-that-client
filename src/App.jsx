import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';

import router from 'config/router';
import store from 'store/store';
import { logout } from 'actions/account/account';
import mainTheme from 'theme/mainTheme';

import 'handsontable/dist/handsontable.full.css';
import './App.css';

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={mainTheme}>
                <SnackbarProvider
                    maxSnack={3}
                    preventDuplicate
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
        );
    }
}

export default App;
