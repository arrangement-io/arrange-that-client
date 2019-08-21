import React from 'react';
import ReactDOM from 'react-dom';
import store from 'store/store'
import ReactGA from 'react-ga';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactGA.initialize('UA-146133959-1');

function handleChange () {
    // handle change
    // console.log(store.getState())
}

store.subscribe(handleChange)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
