import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import { post, get } from 'services/request'
import config from 'config.json'
import { connect } from 'react-redux'

import { setAccount } from 'actions/account/account'
import { setArrangements } from 'actions/arrangements/arrangements'

class GoogleLoginPage extends Component {

  constructor() {
    super();
    this.state = { 
      isAuthenticated: false,
      user: null,
      token: ''
    }
  }
  logout = () => {
    const account = {
      isAuthenticated: false,
      token: '',
      user: null
    }
    this.setState(account)
    this.props.setAccount(account)
  }

  onFailure = (error) => {
    alert(error);
  }

  googleResponse = (response) => {
    console.log(response);
    const data = {
      access_token: response.accessToken
    }
    post({
      url: '/login',
      data: data
    })
    .then(res => {
      console.log(res.data);
      const account = {
        user: response.profileObj, token: response.accessToken, isAuthenticated: true
      }
      this.setState(account)
      this.props.setAccount(account)
      // this.props.history.push('/arrangement')
      get({
        // url: '/arrangements/' + account.user.googleId
        url: '/arrangements/115514976324563592661'
      })
      .then(res => {
        console.log(res)
        let arrangements = [];
        for (var index in res.data.arrangements) {
          var ele = {
            id: res.data.arrangements[index]._id,
            name: res.data.arrangements[index].name
          }
          arrangements.push(ele)
        }
        this.props.setArrangements(arrangements)
        Promise.resolve()
      })
      .catch(err => {
        console.log(err)
        Promise.reject(err)
      })
    })
    .catch(err => {
      console.log(err)
      Promise.reject(err)
    })
  }

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

const mapStateToProps = (state, ownProps) => {
  const {
    account
  } = state
  return {
    account
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setAccount: (account) => {
      dispatch(setAccount(account))
    },
    setArrangements: (arrangements) => {
      dispatch(setArrangements(arrangements))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (GoogleLoginPage)