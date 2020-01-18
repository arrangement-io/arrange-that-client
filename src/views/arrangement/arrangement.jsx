import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { Grid, Typography } from '@material-ui/core';
import Snapshot from 'containers/snapshot/snapshot';
import SheetView from 'containers/listView/sheetView';
import ExportView from 'containers/exportView/exportView';

import EditArrangementTitle from 'components/editArrangementTitle/editArrangementTitle';
import SnapshotTitle from 'components/snapshotTitle/snapshotTitle';

import { getArrangement } from 'services/arrangementService';

import { setRealData, arrangementRename } from 'actions/real/real';
import { snapshotAdd, snapshotDelete, snapshotRename, snapshotReposition } from 'actions/snapshot/snapshot';
import { setDisplayNotes } from 'actions/arrangementSettingsActions';
import { migrate } from 'utils/migrate';
import { uuid } from 'utils';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import LinearProgress from '@material-ui/core/LinearProgress';

import Tabs, { Tab } from 'react-awesome-tabs';
import { ARRANGEMENT_CATEGORY, NEW_SNAPSHOT_ACTION, CLONE_SNAPSHOT_ACTION } from '../../analytics/gaArrangementConstants';

const styles = theme => ({
    header: {
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '15px',
        minHeight: '64px',
    },
    buttonGroup: {
        marginBottom: '8px',
    },
});

const ARRANGE = 'arrange';
const SHEET = 'sheet';
const EXPORT = 'export';

export class Arrange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            isEdit: false,
            name: this.props.real.name,
            isListView: false,
            viewType: ARRANGE,
            isLoading: true,
        };
    }

    handleViewChange = (event, newViewType) => {
        this.setState({ viewType: newViewType });
    };


    handleActivateListView = () => (event) => {
        this.setState({ isListView: event.target.checked });
    }

    handleActivateDisplayNotes = () => (event) => {
        this.props.setDisplayNotes(event.target.checked);
    }

    handleTabSwitch = (active) => {
        this.setState({ activeTab: active });
    }

    handleTabAdd = () => {
        const numberOfCurrentSnapshots = this.props.real.snapshots.length;
        this.props.snapshotAdd(this.createNewSnapshot());

        this.setState({
            activeTab: numberOfCurrentSnapshots,
        });
    }

    handleTabPositionChange = (a, b) => {
        this.props.snapshotReposition(a, b);
        if (this.state.activeTab === a) {
            this.setState({ activeTab: b });
        } else if (this.state.activeTab === b) {
            this.setState({ activeTab: a });
        }

        this.forceUpdate();
    }

    deleteSnapshot = (snapshotId) => {
        this.props.snapshotDelete(snapshotId);
        const numberOfCurrentSnapshots = this.props.real.snapshots.length;
        this.setState({
            ...this.state,
            activeTab: numberOfCurrentSnapshots - 1,
        });
    }

    handleArrangementTitleEnter = (name) => {
        this.setState({
            ...this.state,
            isEdit: false,
        });
        this.props.arrangementRename(name);
    }

    handleArrangementTitleEsc = () => {
        this.setState({
            ...this.state,
            isEdit: false,
        });
    }

    addEditArrangementTitle = () => {
        this.setState({
            ...this.state,
            isEdit: true,
        });
    }

    displayEditArrangementTitle = () => {
        if (this.state.isEdit) {
            return (
                <EditArrangementTitle
                    name={this.props.real.name}
                    handleEnter={this.handleArrangementTitleEnter}
                    handleEsc={this.handleArrangementTitleEsc} />
            );
        }

        return (
            <Typography variant="h5" gutterBottom align="left">
                {this.props.real.name}
            </Typography>
        );
    }

    createNewSnapshot = () => {
        ReactGA.event({
            category: ARRANGEMENT_CATEGORY,
            action: NEW_SNAPSHOT_ACTION,
        });
        const numberOfCurrentSnapshots = this.props.real.snapshots.length;
        const newSnapshotSnapshot = {};
        const newSnapshotContainers = [];
        Object.values(this.props.real.containers).forEach((container) => { newSnapshotContainers.push({ _id: container._id, items: [] }); });

        const newUnassigned = [];
        Object.values(this.props.real.items).forEach((item) => { newUnassigned.push(item._id); });

        const newSnapshot = {
            _id: uuid('snapshot'),
            name: `Snapshot ${numberOfCurrentSnapshots + 1}`,
            snapshot: newSnapshotSnapshot,
            snapshotContainers: newSnapshotContainers,
            unassigned: [],
        };
        return newSnapshot;
    }

    cloneSnapshot = (snapshotId) => {
        ReactGA.event({
            category: ARRANGEMENT_CATEGORY,
            action: CLONE_SNAPSHOT_ACTION,
        });
        const numberOfCurrentSnapshots = this.props.real.snapshots.length;
        const snapshotToClone = this.props.real.snapshots.find(s => s._id === snapshotId);
        const clone = {
            ...cloneDeep(snapshotToClone),
            _id: uuid('snapshot'),
            name: `Clone of ${snapshotToClone.name}`,
        };

        this.props.snapshotAdd(clone);

        this.setState({
            activeTab: numberOfCurrentSnapshots,
        });
    }

    // Loads the state from the backend given the arrangement_id in the url param
    loadState = () => {
        const id = this.props.match.params.arrangement_id;
        return getArrangement(id)
            .then((response) => {
                if (response.data === 'no arrangement found' || isEmpty(response.data)) {
                    console.log('no arrangement found');
                } else {
                    const data = migrate(response.data);
                    this.props.setRealData(data);
                    console.log(response.data);
                }
                this.setState({
                    ...this.state,
                    isLoading: false,
                });
                Promise.resolve();
            })
            .catch((err) => {
                console.log(err);
                Promise.reject(err);
            });
    }

    componentDidMount() {
        this.loadState();
    }

    render() {
        const { classes } = this.props;

        document.title = `${this.props.real.name} - Arrange.Space`;

        if (this.state.isLoading) {
            return <LinearProgress />;
        }
        return (
            <div>
                <Grid container spacing={1} className={classes.header}>
                    <Grid item xs={6} sm={7} md={8} lg={9} xl={10}>
                        <div className="arrangementTitle" onClick={this.addEditArrangementTitle}>
                            {this.displayEditArrangementTitle()}
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={5} md={4} lg={3} xl={2}>
                        <ToggleButtonGroup
                            className={classes.buttonGroup}
                            value={this.state.viewType}
                            onChange={this.handleViewChange}
                            exclusive
                            size="small">
                            <ToggleButton key={1} value={SHEET}>
                                <Typography variant="button">
                                    data
                                </Typography>
                            </ToggleButton>
                            <ToggleButton key={2} value={ARRANGE}>
                                <Typography variant="button">
                                    arrange
                                </Typography>
                            </ToggleButton>
                            <ToggleButton key={3} value={EXPORT}>
                                <Typography variant="button">
                                    export
                                </Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
                {this.state.viewType === EXPORT ? (
                    <ExportView />
                ) : (
                    <Tabs
                        className={classes.tabContent}
                        active={this.state.activeTab}
                        onTabSwitch={this.handleTabSwitch}
                        onTabAdd={this.handleTabAdd}
                        showAdd={true}
                        draggable={true}
                        onTabPositionChange={this.handleTabPositionChange}
                    >
                        {this.props.real.snapshots.map((snapshot, index) => (
                            <Tab key={index} title={
                                <SnapshotTitle
                                    snapshot={snapshot}
                                    onDelete={this.deleteSnapshot}
                                    onClone={this.cloneSnapshot}
                                    onSave={this.props.snapshotRename} />}>
                                {this.state.viewType === SHEET ? (
                                    <SheetView snapshotId={snapshot._id} />
                                ) : (
                                    <Snapshot snapshotId={snapshot._id} />
                                )}
                            </Tab>
                        ))}
                    </Tabs>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { real, arrangementSettings } = state;
    return { real, arrangementSettings };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    setRealData: (data) => {
        dispatch(setRealData(data));
    },
    arrangementRename: (name) => {
        dispatch(arrangementRename(name));
    },
    snapshotAdd: (snapshot) => {
        dispatch(snapshotAdd(snapshot));
    },
    snapshotDelete: (snapshotId) => {
        dispatch(snapshotDelete(snapshotId));
    },
    snapshotRename: (snapshotId, name) => {
        dispatch(snapshotRename(snapshotId, name));
    },
    snapshotReposition: (a, b) => {
        dispatch(snapshotReposition(a, b));
    },
    setDisplayNotes: (isDisplayNotes) => {
        dispatch(setDisplayNotes(isDisplayNotes));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Arrange));
