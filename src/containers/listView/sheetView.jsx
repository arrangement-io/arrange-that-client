import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { HotTable } from '@handsontable/react';

import { setRealData, setUnassignedItems, setContainerItems } from 'actions/real/real'
import { renameItem } from 'actions/item/item'


import { ContainerFormatter } from './containerFormatter';
import { ContainerCellEditor } from './containerCellEditor';

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
                source: ['a','b','c']
            }
        ];
    }

    generateItemList = (snapshotId) => {
        const snapshot = this.getSnapshot(snapshotId);
        return this.props.real.items.map(item => {
            return {name: item.name, container: this.getContainerForItem(snapshot, item._id)};
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

    render() {
        return (
            <div id="hot-app">
                <HotTable 
                    data={this.state.data} 
                    colHeaders={this.generateColumnHeaders()}
                    columns={this.generateColumnDefs()}
                    rowHeaders={false} 
                    width="600" 
                    height="300" 
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

SheetView.propTypes = {
    snapshotId: PropTypes.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (SheetView);
