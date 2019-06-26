import React, { Component } from 'react'

import { connect } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep';

import { Grid, Typography, List } from '@material-ui/core'
import Snapshot from 'containers/snapshot/snapshot'
import ListView from 'containers/listView/listView'

import EditArrangementTitle from 'components/editArrangementTitle/editArrangementTitle'
import ExportButton from 'components/exportbutton/exportbutton'
import SnapshotTitle from 'components/snapshotTitle/snapshotTitle'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getArrangement } from 'services/arrangementService'

import { setRealData, arrangementRename } from 'actions/real/real'
import { snapshotAdd, snapshotDelete, snapshotRename, snapshotReposition } from 'actions/snapshot/snapshot'
import { uuid } from 'utils'

import Tabs, { Tab } from 'react-awesome-tabs';

export class Arrange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            isEdit: false,
            name: this.props.real.name,
            isListView: false,
        };
    }

    handleActivateListView = () => event => {
        this.setState({ isListView: event.target.checked });
    }


    handleTabSwitch = (active) => {
        this.setState({ activeTab: active })
    }

    handleTabAdd = () => {
        const numberOfCurrentSnapshots = this.props.real.snapshots.length
        this.props.snapshotAdd(this.createNewSnapshot())

        this.setState({
            activeTab: numberOfCurrentSnapshots
        });
    }

    handleTabPositionChange = (a, b) => {
        this.props.snapshotReposition(a, b)
        if (this.state.activeTab == a) {
            this.setState({ activeTab: b });
        } else if (this.state.activeTab == b) {
            this.setState({ activeTab: a });
        }

        this.forceUpdate()
    }

    deleteSnapshot = (snapshotId) => {
        this.props.snapshotDelete(snapshotId)
        const numberOfCurrentSnapshots = this.props.real.snapshots.length
        this.setState({
            ...this.state,
            activeTab: numberOfCurrentSnapshots - 1,
        });
    }

    handleArrangementTitleEnter = (name) => {
        this.setState({
            ...this.state,
            isEdit: false
        })
        this.props.arrangementRename(name)
    }

    handleArrangementTitleEsc = () => {
        this.setState({
            ...this.state,
            isEdit: false
        })
    }

    addEditArrangementTitle = () => {
        this.setState({
            ...this.state,
            isEdit: true
        })
    }

    displayEditArrangementTitle = () => {
        if (this.state.isEdit) {
            return (
                <EditArrangementTitle
                    name={this.props.real.name}
                    handleEnter={this.handleArrangementTitleEnter}
                    handleEsc={this.handleArrangementTitleEsc} />
            )
        }
        else {
            return (
                <Typography variant="headline" gutterBottom align="left">
                    {this.props.real.name}
                </Typography>
            )
        }
    }

    createNewSnapshot = () => {
        const numberOfCurrentSnapshots = this.props.real.snapshots.length
        const newSnapshotSnapshot = {}
        const newSnapshotContainers = []
        for (let container of this.props.real.containers) {
            newSnapshotSnapshot[container._id] = []
        }
        for (let container of this.props.real.containers) {
            newSnapshotContainers.push({ _id: container._id, items: [] })
        }
        const newUnassigned = []
        for (let item of this.props.real.items) {
            newUnassigned.push(item._id)
        }
        const newSnapshot = {
            _id: uuid("snapshot"),
            name: "Snapshot " + (numberOfCurrentSnapshots + 1),
            snapshot: newSnapshotSnapshot,
            snapshotContainers: newSnapshotContainers,
            unassigned: []
        }
        return newSnapshot
    }

    cloneSnapshot = (snapshotId) => {
        const numberOfCurrentSnapshots = this.props.real.snapshots.length
        const snapshotToClone = this.props.real.snapshots.find(s => s._id === snapshotId)
        const clone = {
            ...cloneDeep(snapshotToClone),
            _id: uuid("snapshot"),
            name: "Clone of " + snapshotToClone.name
        }

        this.props.snapshotAdd(clone)

        this.setState({
            activeTab: numberOfCurrentSnapshots
        });
    }

    // Loads the state from the backend given the arrangement_id in the url param
    loadState = () => {
        const id = this.props.match.params.arrangement_id
        return getArrangement(id)
            .then(response => {
                if (response.data.arrangement === "no arrangement found") {
                    console.log("no arrangement found")
                }
                else {
                    this.props.setRealData(response.data)
                }
                Promise.resolve()
            })
            .catch(err => {
                console.log(err)
                Promise.reject(err)
            })
    }

    componentDidMount() {
        this.loadState()
    }

    render() {
        return (
            <div>
                <Grid container spacing={8} className="arrange">
                    <Grid item xs={12} sm={4}>
                        <div className="arrangementTitle" onClick={this.addEditArrangementTitle}>
                            {this.displayEditArrangementTitle()}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="headline" gutterBottom align="center">
                            <ExportButton handleExport={this.exportToTSV} />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.isListView}
                                    onChange={this.handleActivateListView()}
                                />
                            }
                            label="List View"
                        />
                    </Grid>
                </Grid>
                <Tabs
                    active={this.state.activeTab}
                    onTabSwitch={this.handleTabSwitch}
                    onTabAdd={this.handleTabAdd}
                    showAdd={true}
                    draggable={true}
                    onTabPositionChange={this.handleTabPositionChange}
                >
                    {this.props.real.snapshots.map((snapshot, index) => {
                        return (
                            <Tab key={index} title={
                                <SnapshotTitle
                                    snapshot={snapshot}
                                    onDelete={this.deleteSnapshot}
                                    onClone={this.cloneSnapshot}
                                    onSave={this.props.snapshotRename} />}>
                                {this.state.isListView ? (
                                    <ListView snapshotId={snapshot._id} />
                                ) : (
                                    <Snapshot snapshotId={snapshot._id} />
                                )}
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
        arrangementRename: (name) => {
            dispatch(arrangementRename(name))
        },
        snapshotAdd: (snapshot) => {
            dispatch(snapshotAdd(snapshot))
        },
        snapshotDelete: (snapshotId) => {
            dispatch(snapshotDelete(snapshotId))
        },
        snapshotRename: (snapshotId, name) => {
            dispatch(snapshotRename(snapshotId, name))
        },
        snapshotReposition: (a, b) => {
            dispatch(snapshotReposition(a, b))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Arrange)
