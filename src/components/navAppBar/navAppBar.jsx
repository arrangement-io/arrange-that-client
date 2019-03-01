import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { GoogleLogin } from 'react-google-login'
import { post } from 'services/request'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { setAccount, logout } from 'actions/account/account'
import config from 'config.json'

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class NavAppBar extends Component {
    logout = () => {
        this.props.logout()
        this.props.history.push("/")
    }

    goToNewArrangement = () => {
        this.props.history.push("/addarrangement")
    }

    goToViewAllArrangements = () => {
        this.props.history.push("/all_arrangements")
    }

    onFailure = (error) => {
        alert(error);
    }

    googleResponse = (response) => {
        const data = {
            access_token: response.accessToken
        }
        post({
            url: '/login',
            data: data
        })
            .then(res => {
                const account = {
                    user: response.profileObj, token: response.accessToken, isAuthenticated: true
                }
                this.props.setAccount(account)
                this.goToViewAllArrangements()
                Promise.resolve()
            })
            .catch(err => {
                console.log(err)
                Promise.reject(err)
            })
    }

    render () {
        const classes = this.props.classes
        console.log(this.props)
        let buttons = null

        if (this.props.account.isAuthenticated) {
            buttons = (
                <div>
                    <Button onClick={this.goToNewArrangement} color="inherit">
                        New
                    </Button>
                    <Button onClick={this.goToViewAllArrangements} color="inherit">
                        View All
                    </Button>
                    <Button onClick={this.logout} color="inherit">
                        Logout
                    </Button>
                </div>
            )
        }
        else {
            buttons = (
                <div>
                    <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                        requestTokenUrl="https://www.googleapis.com/oauth2/v1/userinfo"
                    />
                </div>
            )
        }

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="headline" color="inherit" align="left" className={classes.grow}>
                            Arrange.Space
                        </Typography>
                        {buttons}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

NavAppBar.propTypes = {
    classes: PropTypes.object.isRequired
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
        logout: () => {
            dispatch(logout())
        },
        setAccount: (account) => {
            dispatch(setAccount(account))
        }
    }
}

const MyNavAppBar = withStyles(styles)(NavAppBar)
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps)(MyNavAppBar))