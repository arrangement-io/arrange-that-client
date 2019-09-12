import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import NavAppBar from 'components/navAppBar/navAppBar';

export class Header extends Component {
    render() {
        return <NavAppBar />;
    }
}

const mapStateToProps = (state, ownProps) => {
    const {
        account,
    } = state;
    return {
        account,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Header));
