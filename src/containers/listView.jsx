import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import { setRealData, setUnassignedItems, setContainerItems } from 'actions/real/real'
import { renameItem } from 'actions/item/item'


const NAME_HEADER = "Name";
const NAME_FIELD = "name";
const SPACE_HEADER = "Container";
const SPACE_FIELD = "container";

class ListView extends Component {
    generateItemList = (snapshotId) => {
        const itemList = [];
        const snapshot = this.getSnapshot(snapshotId);
        this.props.real.items.map(item => 
            itemList.push({
                name: item.name,
                container: this.getContainerIdForItem(snapshot, item._id)}))
        return itemList;
    }

    getSnapshot = (snapshotId) => {
        return this.props.real.snapshots.find(x => x._id === snapshotId)
    }

    getContainerNameFromContainerId = (containerId) => {
        return this.props.real.containers.find(x => x._id === containerId);
    }

    getContainerIdForItem = (snapshot, itemId) => {
        console.log(snapshot);
        if (snapshot.unassigned.includes(itemId)) {
            return ""
        }
        for (const container of snapshot.snapshotContainers) {
            if (container.items.includes(itemId)) {
                return this.getContainerNameFromContainerId(container._id).name;
            }
        }
        return "unknown"
    }

    onGridReady = (params) => {
        console.log("onGridReady");
    };

    onCellValueChanged = (params) => {
        console.log(params);
        const itemChanged = this.props.real.items[parseInt(params.node.id)];
        console.log(itemChanged);
        console.log(params.value);
        this.props.renameItem({
            ...itemChanged,
            name: params.value
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: NAME_HEADER, 
                field: NAME_FIELD, 
                sortable: true, 
                filter: true, 
                editable: true
            }, {
                headerName: SPACE_HEADER,
                field: SPACE_FIELD
            }],
            rowData: this.generateItemList(this.props.snapshotId)
        }
        console.log(this.props.real)
    }
    
    render() {
        console.log(this.props);
        return (
            <div className="ag-theme-material"
                style={{ 
                    height: '400px', 
                    width: '600px' }}>
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    reactNext={true}
                    onGridReady={this.onGridReady}
                    onCellValueChanged={this.onCellValueChanged}
                >
                </AgGridReact>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { real } = state
    return { real }
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
