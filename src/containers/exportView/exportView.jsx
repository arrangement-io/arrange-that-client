import React from 'react';
import { connect } from 'react-redux';

import { Card, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { HotTable } from '@handsontable/react';

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
        height: 'calc(100vh - 291px)',
        overflow: 'scroll',
    },
});

const exportArrangement = (arrangement, snapshotIds) => {
    const arrangementHeader = [
        [`arrange.space/arrangement/${arrangement._id}`],
    ];
    let arrangementSheet = [
        [arrangement.name],
    ];
    for (const snapshot of arrangement.snapshots) {
        const snapshotSheet = exportSnapshot(arrangement, snapshot);
        arrangementSheet = arrangementSheet.concat(snapshotSheet);
    }

    // Adding buffer to render rows
    arrangementHeader[0] = arrangementHeader[0].concat(generateBlankWidthBuffer(getWidthOfSheet(arrangementSheet)));
    return arrangementHeader.concat(arrangementSheet);
};

const exportSnapshot = (arrangement, snapshot) => {
    const snapshotHeader = [
        [snapshot.name],
    ];
    const snapshotFooter = [
        [],
    ];
    let snapshotSheet = [
        ['car'],
        ['driver'],
        ['passenger'],
    ];
    let snapshotContainers = [
        [],
    ];
    for (const snapshotContainer of snapshot.snapshotContainers) {
        const containerSheet = exportContainer(arrangement, snapshotContainer);
        snapshotContainers = concatColumns(snapshotContainers, containerSheet);
    }
    const containerIndex = generateVerticalIndex(1, getHeightOfSheet(snapshotContainers));
    snapshotContainers = concatColumns(containerIndex, snapshotContainers);
    snapshotSheet = concatColumns(snapshotSheet, snapshotContainers);
    return snapshotHeader.concat(snapshotSheet).concat(snapshotFooter);
};

// Generate a list from 1 to n, starting at index starting to height.
const generateVerticalIndex = (starting, height) => [...Array(height).keys()].map(i => (i < starting ? [''] : [i - starting + 1]));

const getHeightOfSheet = sheet => sheet.length;

const getWidthOfSheet = sheet => sheet.map(row => row.length).reduce((x, y) => Math.max(x, y));

const generateBlankWidthBuffer = n => new Array(n).fill('');

const concatColumns = (leftSheet, rightSheet) => {
    const newSheet = [];
    for (let i = 0; i < leftSheet.length || i < rightSheet.length; i++) {
        if (i < leftSheet.length && i < rightSheet.length) {
            newSheet.push(leftSheet[i].concat(rightSheet[i]));
        }
        // past the right sheet, keep on adding on the left sheet with blank space
        else if (i < leftSheet.length) {
            newSheet.push(leftSheet[i].concat(generateBlankWidthBuffer(getWidthOfSheet(rightSheet))));
        }
        // Need to backfill with empty spaces
        else {
            newSheet.push(generateBlankWidthBuffer(getWidthOfSheet(leftSheet)).concat(rightSheet[i]));
        }
    }
    return newSheet;
};

const getContainer = (arrangement, containerId) => arrangement.containers.find(x => x._id === containerId);

const getItem = (arrangement, itemId) => arrangement.items.find(x => x._id === itemId);

const exportContainer = (arrangement, container) => {
    const containerSheet = [
        [getContainer(arrangement, container._id).name],
    ];
    for (const itemId of container.items) {
        containerSheet.push(exportItem(arrangement, itemId));
    }
    return containerSheet;
};

const exportItem = (arrangement, itemId) => [getItem(arrangement, itemId).name];

const ExportView = (props) => {
    const { classes } = props;

    const data = exportArrangement(props.real);

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <div className={classes.sheet} id="hot-app">
                    <HotTable
                        data={data}
                        rowHeaders={true}
                        colHeaders={true}
                        readOnly={true}
                        minSpareRows={1}
                        height="calc(100vh - 350px)"
                        licenseKey='non-commercial-and-evaluation' />
                </div>
            </CardContent>
        </Card>
    );
};

const mapStateToProps = (state, ownProps) => {
    const { real } = state;
    return { real };
};

const mapDispatchToProps = (dispatch, ownProps) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ExportView));
