import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Grid, Typography } from '@material-ui/core'
import Snapshot from 'containers/snapshot/snapshot'

import ExportButton from 'components/exportbutton/exportbutton'

import { get } from 'services/request'
import { ARRANGEMENT } from 'services/serviceTypes'

import { setRealData, setUnassigned, setSnapshot } from 'actions/real/real'

import Tabs, { Tab } from 'react-awesome-tabs';

export class Arrange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0
        };
    }

    handleTabSwitch(active) {
        this.setState({activeTab: active})
    }

    handleTabAdd() {
        this.tabs.push({
            title: 'New Tab',
            content: 'Hey Buddy!'
        });

        this.setState({
            activeTab: this.tabs.length - 1
        });
    }

    // Loads the state from the backend given the arrangement_id in the url param
    loadState () {
        const id = this.props.match.params.arrangement_id
        return get({url: ARRANGEMENT + "/" + id})
            .then(response => {
                if (response.data.arrangement === "no arrangement found") {
                    console.log("no arrangement found")
                }
                else {
                    this.props.setRealData(response.data.arrangement)
                }
                Promise.resolve()
            })
            .catch(err => {
                console.log(err)
                Promise.reject(err)
            })
    }

    componentDidMount () {
        this.loadState()
    }
    
    render () {
        return (
            <div>
                <Grid container spacing={24} className="arrange">
                    <Grid item xs={12} sm={4}>
                        <Typography variant="headline" gutterBottom align="left">
                            {this.props.real.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="headline" gutterBottom align="center">
                            <ExportButton handleExport={this.exportToTSV}/>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                    </Grid>
                </Grid>
                <Tabs 
                    active={this.state.activeTab} 
                    onTabSwitch={this.handleTabSwitch.bind(this)}
                    draggable={ true }
                >
                    {this.props.real.snapshots.map((snapshot, index) => {
                        console.log(snapshot)
                        return (
                            <Tab key={index} title={snapshot.name}>
                                <Snapshot snapshotId={snapshot._id} />
                            </Tab>
                        )
                    })}
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { real } = state
    return { real }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setRealData: (data) => {
            dispatch(setRealData(data))
        },
        setUnassigned: (data) => {
            dispatch(setUnassigned(data))
        },
        setSnapshot: (data) => {
            dispatch(setSnapshot(data))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (Arrange)
