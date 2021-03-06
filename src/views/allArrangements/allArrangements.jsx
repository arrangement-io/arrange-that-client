import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getAllUsers } from 'services/usersService';
import { setArrangements } from 'actions/arrangements/arrangements';
import { setUsers } from 'actions/users/users';

import AllArrangementsTable from 'containers/allArrangementsTable/allArrangementsTable';

class AllArrangements extends Component {
    loadUsers = () => getAllUsers()
        .then((response) => {
            this.props.setUsers(response.data);
            Promise.resolve();
        })
        .catch((err) => {
            console.log(err);
            Promise.reject(err);
        })

    componentDidMount() {
        this.loadUsers();
    }

    render() {
        document.title = 'View All - Arrange.Space';

        return <AllArrangementsTable />;
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    setArrangements: (arrangements) => {
        dispatch(setArrangements(arrangements));
    },
    setUsers: (users) => {
        dispatch(setUsers(users));
    },
});

export default withRouter(connect(
    null,
    mapDispatchToProps,
)(AllArrangements));
