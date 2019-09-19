import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { GoogleLogin } from 'react-google-login';
import { post } from 'services/request';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { setAccount, logout } from 'actions/account/account';
import { setRealData, saveArrangementState } from 'actions/real/real';
import { uuid } from 'utils';
import config from 'config.json';
import { withSnackbar } from 'notistack';
import { isAuthenticated } from 'services/authService';
import { LOGIN_FAILED_ACTION,
    LOGIN_SUCCEEDED_ACTION,
    USER_CATEGORY,
    LOGIN_ACTION } from '../../analytics/gaUserConstants';

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
        this.props.logout();
    }

    navigateHomeIfLoggedOut = () => {
        if (!isAuthenticated() && this.props.history.location.pathname !== '/') {
            // If not on root page, go to root page
            this.props.history.push('/');
            this.props.enqueueSnackbar('Logged Out');
        }
    }

    goToViewAllArrangements = () => {
        this.props.history.push('/all_arrangements');
    }

    goToFeedback = () => {
        this.props.history.push('/feedback');
    }

    goToTools = () => {
        this.props.history.push('/tools');
    }

    createNewArrangement = () => {
        const d = new Date();
        const arrangement_id = uuid('arrangement');
        const real = {
            user: this.props.account.user.googleId,
            _id: arrangement_id,
            containers: [],
            is_deleted: false,
            items: [],
            name: 'Untitled Arrangement',
            users: [this.props.account.user.googleId],
            owner: this.props.account.user.googleId,
            snapshots: [{
                _id: uuid('snapshot'),
                name: 'Snapshot 1',
                snapshot: {}, // TO REMOVE after it is removed on backend
                snapshotContainers: [],
                unassigned: [],
            }],
            timestamp: d.getTime() / 1000,
            modified_timestamp: d.getTime() / 1000,
        };
        this.props.setRealData(real);
        this.props.saveArrangementState(real);
        this.props.history.push(`/arrangement/${arrangement_id}`);
    }

    onFailure = (error) => {
        this.props.enqueueSnackbar('Could not login');
    }

    googleResponse = (response) => {
        ReactGA.event({
            category: USER_CATEGORY,
            action: LOGIN_ACTION,
        });
        const data = {
            access_token: response.accessToken,
            user_data: response.profileObj,
        };
        post({
            url: '/login',
            headers: { Authorization: `Bearer ${response.tokenId}` },
            data,
        })
            .then((res) => {
                ReactGA.event({
                    category: USER_CATEGORY,
                    action: LOGIN_SUCCEEDED_ACTION,
                });
                const account = {
                    user: response.profileObj,
                    token: response.accessToken,
                    tokenId: response.tokenId,
                };
                ReactGA.set({ userId: account.user.googleId });
                this.props.setAccount(account);
                this.goToViewAllArrangements();
                Promise.resolve();
            })
            .catch((err) => {
                ReactGA.event({
                    category: 'User',
                    action: LOGIN_FAILED_ACTION,
                });
                console.log(err);
                Promise.reject(err);
            });
    }

    render() {
        const { classes } = this.props;
        let buttons = null;

        this.navigateHomeIfLoggedOut();

        if (isAuthenticated()) {
            buttons = (
                <div>
                    <Button onClick={this.createNewArrangement} color="inherit">
                        New
                    </Button>
                    <Button onClick={this.goToViewAllArrangements} color="inherit">
                        View All
                    </Button>
                    <Button onClick={this.goToTools} color="inherit">
                        Tools
                    </Button>
                    <Button onClick={this.goToFeedback} color="inherit">
                        Feedback
                    </Button>
                    <Button onClick={this.logout} color="inherit">
                        Logout
                    </Button>
                </div>
            );
        } else {
            buttons = (
                <div>
                    <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="gpmail"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                        requestTokenUrl="https://www.googleapis.com/oauth2/v1/userinfo"
                        accessType="offline"
                    />
                </div>
            );
        }

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h5" color="inherit" align="left" className={classes.grow}>
                            Arrange.Space
                        </Typography>
                        {buttons}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

NavAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    const {
        account,
    } = state;
    return {
        account,
    };
};

const mapDispatchToProps = dispatch => ({
    logout: () => {
        dispatch(logout());
    },
    setAccount: (account) => {
        dispatch(setAccount(account));
    },
    setRealData: (data) => {
        dispatch(setRealData(data));
    },
    saveArrangementState: (data) => {
        dispatch(saveArrangementState(data));
    },
});

const MyNavAppBar = withSnackbar(withStyles(styles)(NavAppBar));
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyNavAppBar));
