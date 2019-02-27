import React, { Component } from 'react'
import router from 'config/router'
import { Provider } from 'react-redux'
import store from 'store/store'
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
