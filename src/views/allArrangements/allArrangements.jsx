import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { getAllArrangements } from 'services/arrangementService'
import { getAllUsers } from 'services/usersService'
import { setArrangements } from 'actions/arrangements/arrangements'
import { setUsers } from 'actions/users/users'

import AllArrangementsTable from 'containers/allArrangementsTable/allArrangementsTable'

class AllArrangements extends Component {
    loadArrangements () {
        return getAllArrangements(this.props.account.user.googleId)
            .then(response => {
                this.props.setArrangements(response.data.arrangements)
                Promise.resolve()
            })
            .catch(err => {
                console.log(err)
                Promise.reject(err)
            })
    }

    loadUsers = () => {
        return getAllUsers()
            .then(response => {
                this.props.setUsers(response.data.users)
                Promise.resolve()
            })
            .catch(err => {
                console.log(err)
                Promise.reject(err)
            })
    }

    componentDidMount () {
        this.loadArrangements()
        this.loadUsers()
    }

    render () {
        return <AllArrangementsTable />
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
        setArrangements: (arrangements) => {
            dispatch(setArrangements(arrangements))
        },
        setUsers: (users) => {
            dispatch(setUsers(users))
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AllArrangements))