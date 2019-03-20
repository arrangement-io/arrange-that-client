import React, { Component } from 'react'
import { Provider } from 'react-redux'
import router from 'config/router'
import store from 'store/store'
import { SnackbarProvider } from 'notistack';
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

export default App
