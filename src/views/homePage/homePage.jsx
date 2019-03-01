import React, { Component } from 'react'
import { connect } from 'react-redux'

import Background from 'static/space.jpg'

var style = {
    height: `100vh`,
    backgroundImage: `url(${Background})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
}

class HomePage extends Component {
    componentDidMount () {
        if (this.props.account.isAuthenticated) {
            this.props.history.push("/all_arrangements")
        }
    }

    render() {
        return (
            <div style={style}>
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (HomePage)