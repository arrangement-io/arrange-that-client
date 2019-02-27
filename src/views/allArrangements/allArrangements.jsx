import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { get } from 'services/request'
import { ARRANGEMENTS } from 'services/serviceTypes'
import { setArrangements } from 'actions/arrangements/arrangements'


import AllArrangementsTable from 'containers/allArrangementsTable/allArrangementsTable'

class AllArrangements extends Component {
    loadArrangements () {
        return get({url: ARRANGEMENTS + "/" + this.props.account.user.googleId})
            .then(response => {
                this.props.setArrangements(response.data.arrangements)
                Promise.resolve()
            })
            .catch(err => {
                console.log(err)
                Promise.reject(err)
            })
    }

    componentDidMount () {
        this.loadArrangements()
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
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AllArrangements))