import React, { Component } from 'react'
import './App.css'
import router from 'config/router'
import { Provider } from 'react-redux'
import store from 'store/index'
import { GoogleLogin } from 'react-google-login'
import config from './config.json'

class App extends Component {

    constructor() {
        super();
        this.state = { isAuthenticated: false, user: null, token:
            ''};
    }
    logout = () => {
        this.setState({isAuthenticated: false, token: '', user: null})
    };

    onFailure = (error) => {
        alert(error);
    };

    googleResponse = (response) => {
        console.log(response);
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('https://accounts.google.com/signin/oauth/oauthchooseaccount?client_id=206945578523-0h8t8i7k5d09j0vg31ncspa4pbrddff6.apps.googleusercontent.com&as=xFDBemLg1L9ik5llB8K7Uw&destination=http%3A%2F%2Farrangement-server.herokuapp.com&approval_state=!ChRSWklSU2I5OHRWZDJGMVVzUnJMVhIfQTlDMmZ0Y2VkaW9aMEs2dFEwd1Nsa3VsS1ZfSGRSWQ%E2%88%99APNbktkAAAAAXABpjOv6r9QOSQUANtEjaqia7gTv234E&oauthgdpr=1&xsrfsig=AHgIfE85dgKn7GfOJkXL2gDfCd67Z6reRA&flowName=GeneralOAuthFlow', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    this.setState({isAuthenticated: true, user, token})
                }
            });
        })
    };

    render() {
        let content = !!this.state.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            ) :
            (
                <div>
                    <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                    />
                </div>
            );

        return (
            <div className="App">
                {content}
            </div>
        );
    }
}

// TODO: finish implementing the Google SSO and add back the Route function 
//         Route information
//
//          render() {
//              return (
//                  <Provider store={store}>
//                      <div className="App">
//                          { router }
//                     // <Routes name={this.state.appName}/>
//                      </div>
//                  </Provider>
//              )
//          }
// }

export default App
