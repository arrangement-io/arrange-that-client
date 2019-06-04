import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import { setRealData, setUnassignedItems, setContainerItems } from 'actions/real/real'
import { renameItem } from 'actions/item/item'
import { ContainerFormatter } from './containerFormatter';
import { ContainerCellEditor } from './containerCellEditor';

const NAME_HEADER = "Name";
const NAME_FIELD = "name";
const SPACE_HEADER = "Container";
const SPACE_FIELD = "container";

// TODO: Create a renderer for container, so that it renders the container and the occupancy
// https://medium.com/ag-grid/learn-to-customize-react-grid-in-less-than-10-minutes-2ce6845646bb
// Use menu for custom editor
// https://material-ui.com/components/menus/

class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: this.generateColumnDefs(),
            rowData: this.generateItemList(this.props.snapshotId),
            frameworkComponents: {
                'containerFormatter': ContainerFormatter,
                'containerCellEditor': ContainerCellEditor
            }
        }
    }

    // To update the row data if props changes, flushing out old data
    componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.real !== newProps.real) {
            this.setState({ ...this.state,
                rowData: this.generateItemList(this.props.snapshotId),
                columnDefs: this.generateColumnDefs()
            })
        }
        this.api.sizeColumnsToFit();
    }

    generateColumnDefs = () => {
        return [{
            headerName: NAME_HEADER,
            field: NAME_FIELD,
            sortable: true,
            filter: true,
            resizable: true,
            editable: true
        }, {
            headerName: SPACE_HEADER,
            field: SPACE_FIELD,
            editable: true,
            resizable: true,
            cellEditor: 'containerCellEditor',
            cellEditorParams: {
                values: this.props.real.containers
            },
            cellRenderer: 'containerFormatter'
        }]
    }
    
    generateItemList = (snapshotId) => {
        const snapshot = this.getSnapshot(snapshotId);
        return this.props.real.items.map(item => {
            return {name: item.name,container: this.getContainerForItem(snapshot, item._id)};
        });
    }

    getSnapshot = (snapshotId) => {
        return this.props.real.snapshots.find(x => x._id === snapshotId)
    }

    getContainerFromContainerId = (containerId) => {
        return this.props.real.containers.find(x => x._id === containerId);
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

    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;
        this.api.sizeColumnsToFit();
    };

    removeItemFromContainer = (itemId, containerId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        const snapshotContainer = snapshot.snapshotContainers.find(container => container._id === containerId);
        if (snapshotContainer.items.includes(itemId)) {
            const updatedItemsList = snapshotContainer.items.filter(item => item !== itemId);
            this.props.setContainerItems(this.props.snapshotId, containerId, updatedItemsList);
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
            this.props.setContainerItems(this.props.snapshotId, containerId, updatedItemsList);
        }
        else {
            console.log("Item was already in container when it shouldn't be!");
        }
    }

    removeItemFromUnassigned = (itemId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        if (snapshot.unassigned.includes(itemId)) {
            const updatedItemsList = snapshot.unassigned.filter(item => item !== itemId);
            this.props.setUnassignedItems(this.props.snapshotId, updatedItemsList);
        }
        else {
            console.log("Item was not found in unassigned when it shouldn't be!");
        }
    }
    
    addItemToUnassigned = (itemId) => {
        const snapshot = this.getSnapshot(this.props.snapshotId);
        if (!snapshot.unassigned.includes(itemId)) {
            const updatedItemsList = [...snapshot.unassigned, itemId];
            this.props.setUnassignedItems(this.props.snapshotId, updatedItemsList);
        }
        else {
            console.log("Item was found in unassigned when it shouldn't be!");
        }
    }

    onCellValueChanged = (params) => {    
        if (params.colDef.field === NAME_FIELD) {
            // Renaming the item
            const itemChanged = this.props.real.items[parseInt(params.node.id)];
            this.props.renameItem({
                ...itemChanged,
                name: params.value
            })
        }
        if (params.colDef.field === SPACE_FIELD) {
            // Changing the container
            const itemChanged = this.props.real.items[parseInt(params.node.id)];
            if (params.value && params.oldValue) {
                if (params.value._id === params.oldValue._id) {
                    // Move to same container
                    // Do nothing
                    console.log("Same Container");
                } else {
                    // Move from one container to the other container.
                    console.log("New Container");
                    this.removeItemFromContainer(itemChanged._id, params.oldValue._id);
                    this.addItemToContainer(itemChanged._id, params.value._id);   
                }
            } else if (params.value) {
                // Move from unassigned to container
                console.log("Move from unassigned to container");
                this.removeItemFromUnassigned(itemChanged._id);
                this.addItemToContainer(itemChanged._id, params.value._id);   
            } else if (params.oldValue) {
                // Move from container to unassigned
                console.log("Move from container to unassigned");
                this.removeItemFromContainer(itemChanged._id, params.oldValue._id);
                this.addItemToUnassigned(itemChanged._id);
            } else {
                // Move from unassigned to unassigned
                // Do nothing
                console.log("remain unassigned");
            }
        }
        this.api.setRowData(this.state.rowData);
    }

    render() {
        return (
            <div className="ag-theme-material"
                style={{ 
                    height: '100vh', 
                    width: '100vw' }}>
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    reactNext={true}
                    onGridReady={this.onGridReady}
                    onCellValueChanged={this.onCellValueChanged}
                    frameworkComponents={this.state.frameworkComponents}
                >
                </AgGridReact>
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
        renameItem: (item) => {
            dispatch(renameItem(item))
        },
        setRealData: (data) => {
            dispatch(setRealData(data))
        },
        setUnassignedItems: (snapshotId, unassigned) => {
            dispatch(setUnassignedItems(snapshotId, unassigned))
        },
        setContainerItems: (snapshotId, containerId, items) => {
            dispatch(setContainerItems(snapshotId, containerId, items))
        }
    }
}

ListView.propTypes = {
    snapshotId: PropTypes.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (ListView);
