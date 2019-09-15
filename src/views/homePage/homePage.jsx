import React, { Component } from 'react';
import { connect } from 'react-redux';

import Background from 'static/space.jpg';

import LinearProgress from '@material-ui/core/LinearProgress';

import isAuthenticated from 'services/authService';

const style = {
    height: '100vh',
    backgroundImage: `url(${Background})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
};

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
        if (isAuthenticated()) {
            this.setState({ loading: true });
            setTimeout(() => {
                this.props.history.push('/all_arrangements');
            }, 100);
        }
    }

    render() {
        document.title = 'Arrange.Space';

        const loadingComponent = this.state.loading ? <LinearProgress /> : null;
        return (
            <div style={style}>
                {loadingComponent}
            </div>
        );
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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomePage);
