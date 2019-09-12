import React, { Component } from 'react';
import { connect } from 'react-redux';

import RosterChecker from 'containers/rosterChecker/rosterChecker';

class Tools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    render() {
        document.title = 'Tools - Arrange.Space';

        return (
            <div>
                <RosterChecker />
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
)(Tools);
