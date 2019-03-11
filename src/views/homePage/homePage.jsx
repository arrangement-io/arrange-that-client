import React, { Component } from 'react'
import { connect } from 'react-redux'

import Background from 'static/space.jpg'

import LinearProgress from '@material-ui/core/LinearProgress';

var style = {
    height: `100vh`,
    backgroundImage: `url(${Background})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
}

class HomePage extends Component {
    constructor (props) {
        super(props)

        this.state = {
            loading: false
        }
    }

    componentDidMount () {
        if (this.props.account.isAuthenticated) {
            this.setState({loading: true})
            setTimeout(function() {
                this.props.history.push("/all_arrangements")
            }.bind(this), 100)
        }
    }

    render() {
        const loadingComponent = this.state.loading ? <LinearProgress /> : null
        return (
            <div style={style}>
                {loadingComponent}
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
