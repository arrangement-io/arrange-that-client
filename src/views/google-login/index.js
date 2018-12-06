import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import { post } from 'services/request'
import config from 'config.json'

class GoogleLoginPage extends Component {

    constructor() {
        super();
        this.state = { 
            isAuthenticated: false,
            user: null,
            token: ''
        };
    }
    logout = () => {
        this.setState({isAuthenticated: false, token: '', user: null})
    };

    onFailure = (error) => {
        alert(error);
    };

    googleResponse = (response) => {
        console.log(response);
        const data = {
            access_token: response.accessToken
        };
        post({
            url: '/login',
            data: data
        })
            .then(res => {
                console.log(res.data);
                this.setState({user: response.profileObj, token: response.accessToken, isAuthenticated: true});
                this.props.history.push('/arrangement')
            })
            .catch(err => {
                console.log(err)
            });
    };

    render() {
        console.log(config.GOOGLE_CLIENT_ID);
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
                        requestTokenUrl="https://www.googleapis.com/oauth2/v1/userinfo"
                    />
                </div>
            );

        return (
            <div>
                {content}
            </div>
        );
    }
}

export default GoogleLoginPage