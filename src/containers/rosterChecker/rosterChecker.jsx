/**
 * Roster Checker is a tool to compare the arrangement against a roster and see who is missing
 * from the roster.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { HotTable } from '@handsontable/react';
import { Card, CardHeader, CardContent, TextField, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { withSnackbar } from 'notistack';

import { setRealData } from 'actions/real/real';
import { getArrangement } from 'services/arrangementService';

const NAME_FIELD = 'name';
const VALIDITY_FIELD = 'validity';
const PRESENT = 'present';
const MISSING = 'missing';
const SHAMROCK_GREEN = '#0F9D58';
const CINNABAR_RED = '#EA4335';

const styles = theme => ({
    sheet: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#777',
    },
    card: {
        background: '#fafafa',
    },
    cardHeader: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 0,
        paddingRight: 10,
    },
    cardContent: {
        height: 'calc(100vh - 250px)',
        overflow: 'scroll',
    },
});

class SheetView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrangementId: '',
            currentRoster: [],
            newRoster: [],
        };
    }

    generateColumnHeaders = () => this.generateColumnDefs().map(col => col.data)

    generateColumnDefs = () => [
        {
            data: NAME_FIELD,
            width: 220,
        },
        {
            data: VALIDITY_FIELD,
            width: 220,
            readOnly: true,
            renderer: this.renderValidity,
        },
    ]

    generateCurrentRoster = () => {
        const itemList = [];
        console.log(this.props.real);
        if (!isEmpty(this.props.real)) {
            console.log('generating item list...');

            this.props.real.items.forEach((item) => {
                const validityOfItem = this.checkIfNameInRoster(item.name, this.state.newRoster) ? PRESENT : MISSING;
                itemList.push({ name: item.name, validity: validityOfItem });
            });
            this.setState({ ...this.state, currentRoster: itemList });
        }
        return itemList;
    }

    getItemFromItemName = itemName => this.props.real.items.find(x => x.name === itemName)

    renderValidity = (instance, td, row, col, prop, value, cellProperties) => {
        if (value === PRESENT) {
            td.style.backgroundColor = SHAMROCK_GREEN;
        } else if (value === MISSING) {
            td.style.backgroundColor = CINNABAR_RED;
        }
        return td.innerHTML = value;
    }

    checkIfNameInRoster = (name, roster) => roster.filter(row => row.name === name).length > 0

    processChangeItemName = (row, columnTitle, previous, current) => {
        const newRosterClone = cloneDeep(this.state.newRoster);
        const validityOfItem = this.checkIfNameInRoster(current, this.state.currentRoster) ? PRESENT : MISSING;
        newRosterClone[row] = { name: current, validity: validityOfItem };
        this.setState({ ...this.state, newRoster: newRosterClone });
    }

    processChange = (row, columnTitle, previous, current) => {
        if (columnTitle === NAME_FIELD) {
            this.processChangeItemName(row, columnTitle, previous, current);
        }
    }

    onCellValueChange = (changes, source) => {
        if (changes) {
            changes.forEach((change) => {
                const [row, columnTitle, previous, current] = change;
                this.processChange(row, columnTitle, previous, current);
            });
            this.generateCurrentRoster();
        }
    }

    setArrangementId = (event) => {
        this.setState({
            ...this.state,
            arrangementId: event.target.value,
        });
    }

    catchReturn = (event) => {
        if (event.key === 'Enter') {
            this.loadArrangement();
        }
    }

    loadArrangement = () => {
        if (this.state.arrangementId) {
            return getArrangement(this.state.arrangementId)
                .then((response) => {
                    if (isEmpty(response.data)) {
                        this.props.enqueueSnackbar('Invalid Arrangement ID');
                        console.log('no arrangement found');
                    } else {
                        console.log('setting roster');
                        this.props.setRealData(response.data);
                        this.generateCurrentRoster();
                    }
                    Promise.resolve();
                })
                .catch((err) => {
                    console.log(err);
                    this.props.enqueueSnackbar('Invalid Arrangement ID');
                    Promise.reject(err);
                });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader className={classes.cardHeader} title="Roster Checker" />
                <CardContent>
                    <TextField
                        id="outlined-name"
                        label="Arrangement ID"
                        value={this.state.arrangementId}
                        onChange={this.setArrangementId}
                        onBlur={this.loadArrangement}
                        onKeyPress={this.catchReturn}
                        margin="normal"
                        variant="outlined"
                    />
                </CardContent>
                <CardContent className={classes.cardContent}>
                    <Grid container spacing={1} className={classes.header}>
                        <Grid item xs={6} sm={6}>
                            <Typography variant="h5">
                                Current Roster
                            </Typography>
                            <div className={classes.sheet} id="hot-app">
                                <HotTable
                                    data={this.state.currentRoster}
                                    colHeaders={this.generateColumnHeaders()}
                                    columns={this.generateColumnDefs()}
                                    rowHeaders={false}
                                    afterChange={this.onCellValueChange}
                                    minSpareRows={1}
                                    height="calc(100vh - 300px)"
                                    readOnly={true}
                                    columnSorting={true}
                                    licenseKey='non-commercial-and-evaluation' />
                            </div>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <Typography variant="h5">
                                Roster to Check
                            </Typography>
                            <div className={classes.sheet} id="hot-app2">
                                <HotTable
                                    data={this.state.newRoster}
                                    colHeaders={this.generateColumnHeaders()}
                                    columns={this.generateColumnDefs()}
                                    rowHeaders={false}
                                    afterChange={this.onCellValueChange}
                                    minSpareRows={1}
                                    columnSorting={true}
                                    height="calc(100vh - 300px)"
                                    licenseKey='non-commercial-and-evaluation' />
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { real } = state;
    return { real };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    setRealData: (data) => {
        dispatch(setRealData(data));
    },
});

SheetView.propTypes = {
    snapshotId: PropTypes.string,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withSnackbar(withStyles(styles)(SheetView)));
