import React from 'react'
import { connect } from 'react-redux'

const ExportView = (props) => {

    return (<div>Export View</div>);
}

const mapStateToProps = (state, ownProps) => {
    const { real } = state;
    return { real }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExportView);