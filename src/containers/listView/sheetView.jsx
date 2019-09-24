import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


import { setRealData, bulkSetUnassignedItems, bulkSetContainerItems, saveArrangementState } from 'actions/real/real';
import { bulkAddItem, bulkUpdateItem, bulkDeleteItem } from 'actions/item/item';
import { generateItem } from 'utils';


const NAME_FIELD = 'name';
const CONTAINER_FIELD = 'container';
const NOTES_FIELD = 'notes';

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
        height: 'calc(100vh - 341px)',
        overflow: 'scroll',
    },
});

class SheetView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.generateItemList(this.props.snapshotId),
            contextMenu: {
                callback(key, selection, clickEvent) {
                    // Common callback for all options
                },
                items: {
                    insert_column: {
                        name: 'Insert Column',
                        submenu: {
                            items: [
                                {
                                    key: 'insert_column:address',
                                    name: 'Address',
                                    disabled() { return true; },
                                },
                                {
                                    key: 'insert_column:gender',
                                    name: 'Gender',
                                    disabled() { return true; },
                                },
                                {
                                    key: 'insert_column:year',
                                    name: 'Year',
                                    disabled() { return true; },
                                },
                            ],
                        },
                    },
                    alignment: {
                        name: 'Alignment',
                    },
                },
            },
        };
    }

    generateColumnHeaders = () => this.generateColumnDefs().map(col => col.data)

    generateColumnDefs = () => [
        {
            data: NAME_FIELD,
            width: 120,
        },
        {
            data: NOTES_FIELD,
            width: 220,
        },
        {
            data: CONTAINER_FIELD,
            type: 'dropdown',
            source: Object.values(this.props.real.containers).map(container => container.name),
            renderer: this.renderContainerChip,
            allowInvalid: false,
            width: 220,
        },
    ]

    generateItemList = (snapshotId) => {
        const snapshot = this.getSnapshot(snapshotId);
        return Object.values(this.props.real.items).map((item) => {
            const container = this.getContainerForItem(snapshot, item._id);
            const containerName = (container) ? container.name : null;
            return { ...item, container: containerName };
        });
    }

    getSnapshot = snapshotId => this.props.real.snapshots.find(x => x._id === snapshotId)

    getContainerFromContainerId = containerId => this.props.real.containers[containerId]

    getContainerFromContainerName = containerName => Object.values(this.props.real.containers)
        .find(x => x.name === containerName);

    getItemFromItemName = itemName => Object.values(this.props.real.items).find(x => x.name === itemName)

    getItemFromRow = row => this.props.real.items[this.state.data[row]._id];

    getContainerForItem = (snapshot, itemId) => {
        if (snapshot.unassigned.includes(itemId)) {
            return null;
        }
        for (const container of snapshot.snapshotContainers) {
            if (container.items.includes(itemId)) {
                return this.getContainerFromContainerId(container._id);
            }
        }
        return null;
    }

    renderContainerChip = (instance, td, row, col, prop, value, cellProperties) => {
        if (value) {
            const container = this.getContainerFromContainerName(value);
            if (container) {
                const count = instance.getDataAtCol(col).filter(x => x === value).length;
                const total = container.size;

                const escaped = Handsontable.helper.stringify(value);
                return td.innerHTML = `${escaped} (${count}/${total})`;
            }
        }
        return td.innerHTML = value;
    }

    removeItemFromContainer = (itemId, containerId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        const snapshotContainer = snapshot.snapshotContainers.find(container => container._id === containerId);
        if (snapshotContainer.items.includes(itemId)) {
            const updatedItemsList = snapshotContainer.items.filter(item => item !== itemId);
            this.props.bulkSetContainerItems(this.props.snapshotId, containerId, updatedItemsList);
        } else {
            console.log("Item was not found in container when it shouldn't be!");
        }
    }

    addItemToContainer = (itemId, containerId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        const snapshotContainer = snapshot.snapshotContainers.find(container => container._id === containerId);
        if (!snapshotContainer.items.includes(itemId)) {
            const updatedItemsList = [...snapshotContainer.items, itemId];
            this.props.bulkSetContainerItems(this.props.snapshotId, containerId, updatedItemsList);
        } else {
            console.log("Item was already in container when it shouldn't be!");
        }
    }

    removeItemFromUnassigned = (itemId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        if (snapshot.unassigned.includes(itemId)) {
            const updatedItemsList = snapshot.unassigned.filter(item => item !== itemId);
            this.props.bulkSetUnassignedItems(this.props.snapshotId, updatedItemsList);
        } else {
            console.log("Item was not found in unassigned when it shouldn't be!");
        }
    }

    addItemToUnassigned = (itemId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        if (!snapshot.unassigned.includes(itemId)) {
            const updatedItemsList = [...snapshot.unassigned, itemId];
            this.props.bulkSetUnassignedItems(this.props.snapshotId, updatedItemsList);
        } else {
            console.log("Item was found in unassigned when it shouldn't be!");
        }
    }

    processChangeItemName = (row, columnTitle, previous, current) => {
        const item = this.getItemFromItemName(previous);
        if (item) {
            if (current === null || !current) {
                // Delete the item
                this.props.bulkDeleteItem(item._id);
            } else {
                // Rename already existing item
                this.props.bulkUpdateItem({
                    ...item,
                    name: current,
                });
            }
        } else {
            // Creating a new item if it didn't exist
            const newItem = generateItem(current, Object.values(this.props.real.items));
            if (newItem) {
                this.props.bulkAddItem(newItem);
            }
        }
    }

    processChangeItemNotes = (row, columnTitle, previous, current) => {
        const itemChanged = this.getItemFromRow(row);
        if (itemChanged) {
            if (current === null || !current) {
                // Delete the note
                this.props.bulkUpdateItem({
                    ...itemChanged,
                    notes: '',
                });
            }
            this.props.bulkUpdateItem({
                ...itemChanged,
                notes: current,
            });
        }
    }

    processChangeContainerName = (row, columnTitle, previous, current) => {
        const itemChanged = this.getItemFromRow(row);
        if (itemChanged) {
            if (current
                && previous
                && this.getContainerFromContainerName(previous)
                && this.getContainerFromContainerName(current)) {
                if (current === previous) {
                    // Move to same container
                    // Do nothing
                    console.debug('Same Container');
                } else {
                    // Move from one container to the other container.
                    console.debug('New Container');
                    this.removeItemFromContainer(itemChanged._id, this.getContainerFromContainerName(previous)._id);
                    this.addItemToContainer(itemChanged._id, this.getContainerFromContainerName(current)._id);
                }
            } else if (current && this.getContainerFromContainerName(current)) {
                // Move from unassigned to container
                console.debug('Move from unassigned to container');
                this.removeItemFromUnassigned(itemChanged._id);
                this.addItemToContainer(itemChanged._id, this.getContainerFromContainerName(current)._id);
            } else if (previous && this.getContainerFromContainerName(previous)) {
                // Move from container to unassigned
                console.debug('Move from container to unassigned');
                this.removeItemFromContainer(itemChanged._id, this.getContainerFromContainerName(previous)._id);
                this.addItemToUnassigned(itemChanged._id);
            } else {
                // Move from unassigned to unassigned
                // Do nothing
                console.debug('remain unassigned');
            }
        }
    }
    processChange = (row, columnTitle, previous, current) => {
        if (columnTitle === NAME_FIELD) {
            this.processChangeItemName(row, columnTitle, previous, current);
        } else if (columnTitle === CONTAINER_FIELD) {
            this.processChangeContainerName(row, columnTitle, previous, current);
        } else if (columnTitle === NOTES_FIELD) {
            this.processChangeItemNotes(row, columnTitle, previous, current);
        }
    }

    onCellValueChange = (changes, source) => {
        if (changes) {
            changes.forEach((change) => {
                const [row, columnTitle, previous, current] = change;
                this.processChange(row, columnTitle, previous, current);
            });
            this.props.saveArrangementState();
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader className={classes.cardHeader} title="People" />
                <CardContent className={classes.cardContent}>
                    <div className={classes.sheet} id="hot-app">
                        <HotTable
                            data={this.state.data}
                            colHeaders={this.generateColumnHeaders()}
                            columns={this.generateColumnDefs()}
                            rowHeaders={false}
                            afterChange={this.onCellValueChange}
                            minSpareRows={1}
                            height="calc(100vh - 400px)"
                            licenseKey='non-commercial-and-evaluation' />
                    </div>

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
    bulkUpdateItem: (item) => {
        dispatch(bulkUpdateItem(item));
    },
    bulkAddItem: (item) => {
        dispatch(bulkAddItem(item));
    },
    bulkDeleteItem: (item) => {
        dispatch(bulkDeleteItem(item));
    },
    saveArrangementState: () => {
        dispatch(saveArrangementState());
    },
    setRealData: (data) => {
        dispatch(setRealData(data));
    },
    bulkSetUnassignedItems: (snapshotId, unassigned) => {
        dispatch(bulkSetUnassignedItems(snapshotId, unassigned));
    },
    bulkSetContainerItems: (snapshotId, containerId, items) => {
        dispatch(bulkSetContainerItems(snapshotId, containerId, items));
    },
});

SheetView.propTypes = {
    snapshotId: PropTypes.string,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SheetView));
