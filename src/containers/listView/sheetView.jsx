import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

import { setRealData, bulkSetUnassignedItems, bulkSetContainerItems, saveState } from 'actions/real/real'
import { bulkAddItem, bulkRenameItem, bulkDeleteItem } from 'actions/item/item'
import { generateItem } from 'utils'

import { withStyles } from '@material-ui/core/styles'


const NAME_FIELD = "name";
const CONTAINER_FIELD = "container";

const styles = theme => ({
    sheet: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#777"
    }
})

class SheetView extends Component {
    constructor(props) {
        super(props);
        this.state = {data: this.generateItemList(this.props.snapshotId)}
    }

    generateColumnHeaders = () => {
        return this.generateColumnDefs().map(col => col.data);
    }

    generateColumnDefs = () => {
        return [
            {data: "name"}, 
            {
                data:"container", 
                type: 'dropdown',
                source: this.props.real.containers.map(container => container.name),
                renderer: this.renderContainerChip,
                allowInvalid: false
            }
        ];
    }

    generateItemList = (snapshotId) => {
        const snapshot = this.getSnapshot(snapshotId);
        return this.props.real.items.map(item => {
            let container = this.getContainerForItem(snapshot, item._id)
            let containerName = (container) ? container.name : null
            return {name: item.name, container: containerName};
        });
    }

    getSnapshot = (snapshotId) => {
        return this.props.real.snapshots.find(x => x._id === snapshotId)
    }

    getContainerFromContainerId = (containerId) => {
        return this.props.real.containers.find(x => x._id === containerId);
    }

    getContainerFromContainerName = (containerName) => {
        return this.props.real.containers.find(x => x.name === containerName);
    }

    getItemFromItemName = (itemName) => {
        return this.props.real.items.find(x => x.name === itemName);
    }

    getContainerForItem = (snapshot, itemId) => {
        if (snapshot.unassigned.includes(itemId)) {
            return null;
        }
        for (const container of snapshot.snapshotContainers) {
            if (container.items.includes(itemId)) {
                return this.getContainerFromContainerId(container._id);
            }
        }
        return null
    }

    renderContainerChip = (instance, td, row, col, prop, value, cellProperties) => {
        if (value) {
            const container = this.getContainerFromContainerName(value);
            if (container) {
                const count = instance.getDataAtCol(col).filter(x => x == value).length
                const total = container.size
            
                const escaped = Handsontable.helper.stringify(value);
                return td.innerHTML = escaped + " (" + count + "/" + total + ")";
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
        }
        else {
            console.log("Item was not found in container when it shouldn't be!");
        }
    }

    addItemToContainer = (itemId, containerId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        const snapshotContainer = snapshot.snapshotContainers.find(container => container._id === containerId);
        if (!snapshotContainer.items.includes(itemId)) {
            const updatedItemsList = [...snapshotContainer.items, itemId];
            this.props.bulkSetContainerItems(this.props.snapshotId, containerId, updatedItemsList);
        }
        else {
            console.log("Item was already in container when it shouldn't be!");
        }
    }

    removeItemFromUnassigned = (itemId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        if (snapshot.unassigned.includes(itemId)) {
            const updatedItemsList = snapshot.unassigned.filter(item => item !== itemId);
            this.props.bulkSetUnassignedItems(this.props.snapshotId, updatedItemsList);
        }
        else {
            console.log("Item was not found in unassigned when it shouldn't be!");
        }
    }
    
    addItemToUnassigned = (itemId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        if (!snapshot.unassigned.includes(itemId)) {
            const updatedItemsList = [...snapshot.unassigned, itemId];
            this.props.bulkSetUnassignedItems(this.props.snapshotId, updatedItemsList);
        }
        else {
            console.log("Item was found in unassigned when it shouldn't be!");
        }
    }

    processChangeItemName = (row, columnTitle, previous, current) => {
        const item = this.getItemFromItemName(previous);
        if (item) {
            if (current === null || !current) {
                // Delete the item  
                this.props.bulkDeleteItem(item._id);
            }
            else {
                // Rename already existing item
                this.props.bulkRenameItem({
                    ...item,
                    name: current
                })
            }    
        }
        else {
            // Creating a new item if it didn't exist
            const newItem = generateItem(current, this.props.real.items);
            if (newItem) {
                this.props.bulkAddItem(newItem);
            }
        }    
    }

    processChangeContainerName = (row, columnTitle, previous, current) => {
        // TODO: Validate that the container name changing to exists
        const itemChanged = this.props.real.items[row]
        if (current 
            && previous 
            && this.getContainerFromContainerName(previous) 
            && this.getContainerFromContainerName(current)) {
            if (current === previous) {
                // Move to same container
                // Do nothing
                console.debug("Same Container");
            } else {
                // Move from one container to the other container.
                console.debug("New Container");
                this.removeItemFromContainer(itemChanged._id, this.getContainerFromContainerName(previous)._id);
                this.addItemToContainer(itemChanged._id, this.getContainerFromContainerName(current)._id);   
            }
        } else if (current && this.getContainerFromContainerName(current)) {
            // Move from unassigned to container
            console.debug("Move from unassigned to container");
            this.removeItemFromUnassigned(itemChanged._id);
            this.addItemToContainer(itemChanged._id, this.getContainerFromContainerName(current)._id);   
        } else if (previous && this.getContainerFromContainerName(previous)) {
            // Move from container to unassigned
            console.debug("Move from container to unassigned");
            this.removeItemFromContainer(itemChanged._id, this.getContainerFromContainerName(previous)._id);
            this.addItemToUnassigned(itemChanged._id);
        } else {
            // Move from unassigned to unassigned
            // Do nothing
            console.debug("remain unassigned");
        }
    }
    processChange = (row, columnTitle, previous, current) => {
        if (columnTitle === NAME_FIELD) {
            this.processChangeItemName(row, columnTitle, previous, current);
        }
        else if (columnTitle === CONTAINER_FIELD) {
            this.processChangeContainerName(row, columnTitle, previous, current);
        }
    }

    onCellValueChange = (changes, source) => {
        if (changes) {
            changes.forEach(change => {
                const [row, columnTitle, previous, current] = change
                this.processChange(row, columnTitle, previous, current);
            })
            this.props.saveState();
        }       
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.sheet} id="hot-app">
                <HotTable 
                    data={this.state.data} 
                    colHeaders={this.generateColumnHeaders()}
                    columns={this.generateColumnDefs()}
                    rowHeaders={false} 
                    afterChange={this.onCellValueChange}
                    minSpareRows={1}
                    height="65vh" 
                    licenseKey='non-commercial-and-evaluation' />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { real } = state;
    return { real };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        bulkRenameItem: (item) => {
            dispatch(bulkRenameItem(item))
        },
        bulkAddItem: (item) => {
            dispatch(bulkAddItem(item))
        },
        bulkDeleteItem: (item) => {
            dispatch(bulkDeleteItem(item))
        },
        saveState: () => {
            dispatch(saveState())
        },
        setRealData: (data) => {
            dispatch(setRealData(data))
        },
        bulkSetUnassignedItems: (snapshotId, unassigned) => {
            dispatch(bulkSetUnassignedItems(snapshotId, unassigned))
        },
        bulkSetContainerItems: (snapshotId, containerId, items) => {
            dispatch(bulkSetContainerItems(snapshotId, containerId, items))
        }
    }
}

SheetView.propTypes = {
    snapshotId: PropTypes.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(SheetView));
