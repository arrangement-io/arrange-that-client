import React, { Component } from 'react'
import { Provider } from 'react-redux'
import router from './config/router.jsx'
import store from './store/store.jsx'
import './App.css'

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    { router }
                </div>
            </Provider>
        )
    }
}

export default App
