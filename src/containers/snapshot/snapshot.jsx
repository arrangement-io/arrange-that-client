import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Grid } from '@material-ui/core'
import ItemCollection from 'containers/itemCollection/itemCollection'
import ContainerCollection from 'containers/containerCollection/containerCollection'
import { DragDropContext } from 'react-beautiful-dnd'
import { saveArrangementState, setUnassignedItems, setContainerItems, bulkSetUnassignedItems, bulkSetContainerItems } from 'actions/real/real'
import { snapshotDndReset, snapshotDndSetDragItem, snapshotDndUnselectItems } from 'actions/snapshotDndActions'
import { snapshotSetContainers } from 'actions/snapshot/snapshot'
import { getSnapshotIndex, getSnapshotContainer } from 'utils'
import { withStyles } from '@material-ui/core/styles'

const UNASSIGNED = "unassigned"

const styles = theme => ({
    snapshotBody: {
        margin: "10px"
    }
});

class Snapshot extends Component {
    componentDidMount () {
        this.healSnapshotContainers(this.props.snapshotId)
        this.healUnassignedItems(this.props.snapshotId)
        window.addEventListener('click', this.onWindowClick);
        window.addEventListener('keydown', this.onWindowKeyDown);
        window.addEventListener('touchend', this.onWindowTouchEnd);
        this.props.snapshotDndReset();
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
        window.removeEventListener('keydown', this.onWindowKeyDown);
        window.removeEventListener('touchend', this.onWindowTouchEnd);
    }

    onWindowKeyDown = (event) => {
        if (event.defaultPrevented) {
            return;
        }
    
        if (event.key === 'Escape') {
            this.props.snapshotDndUnselectItems();
        }
    };
    
      onWindowClick = (event) => {
          if (event.defaultPrevented) {
              return;
          }
          this.props.snapshotDndUnselectItems();
      };
    
      onWindowTouchEnd = (event) => {
          if (event.defaultPrevented) {
              return;
          }
          this.props.snapshotDndUnselectItems();
      };

    onDragStart = (start) => {
        const id = start.draggableId;
        const selected = this.props.snapshotDnd.selectedItems.some(item => item.itemId === id);
    
        // if dragging an item that is not selected - unselect all items
        if (!selected) {
            this.props.snapshotDndUnselectItems();
        }

        this.props.snapshotDndSetDragItem(start.draggableId);
    };

    onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result
        // dropped outside the list
        if (!destination) { 
            return
        }
        if (type === "item") {
            const itemsToMove = this.props.snapshotDnd.selectedItems;
            // Multi
            if (itemsToMove.length > 0) {
                itemsToMove.sort((a,b) => {
                    if (a.containerId === b.containerId) {
                        return a.index - b.index;
                    }
                    return a.containerId < b.containerId ? 1 : -1});
                itemsToMove.forEach(({itemId, containerId}) => this.removeItemFromContainer(itemId, containerId));
                this.addItemsToContainer(itemsToMove.map(item => item.itemId), destination.droppableId, destination.index)
                this.props.saveArrangementState();
            }
            // Single
            else {
                this.removeItemFromContainer(draggableId, source.droppableId);
                this.addItemsToContainer([draggableId], destination.droppableId, destination.index)
                this.props.saveArrangementState();
            }
        }
        this.props.snapshotDndReset();
    }

    getSnapshot = (snapshotId) => {
        return this.props.real.snapshots.find(x => x._id === snapshotId)
    }

    // pushes all the itemIds into containerId at position
    addItemsToContainer = (itemIds, containerId, postion) => {
        if (containerId === UNASSIGNED) {
            const snapshot = this.getSnapshot(this.props.snapshotId);
            const updatedItemsList = snapshot.unassigned.filter(i => !itemIds.includes(i));
            updatedItemsList.splice(postion, 0, ...itemIds)
            this.props.bulkSetUnassignedItems(this.props.snapshotId, updatedItemsList);
        } else {
            const snapshotContainer = getSnapshotContainer(
                this.getSnapshot(this.props.snapshotId),
                containerId);
            const updatedItemsList = snapshotContainer.items.filter(i => !itemIds.includes(i));
            updatedItemsList.splice(postion, 0, ...itemIds)
            this.props.bulkSetContainerItems(this.props.snapshotId, containerId, updatedItemsList);
        }                    
    }

    // Filters out that particular id
    removeItemFromContainer = (itemId, containerId) => {
        if (containerId === UNASSIGNED) {
            const snapshot = this.getSnapshot(this.props.snapshotId);
            if (snapshot.unassigned.includes(itemId)) {
                const updatedItemsList = snapshot.unassigned.filter(item => item !== itemId);
                this.props.bulkSetUnassignedItems(this.props.snapshotId, updatedItemsList);
            }
            else {
                console.log("Item was not found in unassigned when it should be!");
            }
        }
        else {
            const snapshotContainer = getSnapshotContainer(
                this.props.real.snapshots[getSnapshotIndex(this.props.real, this.props.snapshotId)],
                containerId);
            if (snapshotContainer.items.includes(itemId)) {
                const updatedItemsList = snapshotContainer.items.filter(item => item !== itemId);
                this.props.bulkSetContainerItems(this.props.snapshotId, containerId, updatedItemsList);
            }
            else {
                console.log("Item was not found in container when it should be!");
            }
        }
    }

    healUnassignedItems = (snapshotId) => {
        const snap = this.getSnapshot(snapshotId)
        // make sure no undefined items in unassigned
        let clean_unassigned = snap.unassigned.filter(n => n)
        // make sure all unassigned items exist
        clean_unassigned = clean_unassigned.filter(n => this.props.real.items.find(i => i._id === n))
        // make a set of all items
        let unassigned_set = new Set(this.props.real.items.map(item => item._id))
        for (let container of snap.snapshotContainers) {
            // delete items from unassigned if they are assigned to container
            container.items.map(item => unassigned_set.delete(item))
        }
        clean_unassigned.map(item => unassigned_set.delete(item)) // Removed the items that are already in unassigned.
        // Self healing. If there are missing unassigned items, add them back into unassigned.
        if (unassigned_set.size > 0) {
            console.log("there are some missing unassigned")
            Array.from(unassigned_set).map(item => clean_unassigned.push(item))
        }
        this.props.setUnassignedItems(snapshotId, clean_unassigned)
    }

    healSnapshotContainers = (snapshotId) => {
        const snap = this.getSnapshot(snapshotId)
        // make sure no undefined and null containers
        let cleanSnapshotContainers = snap.snapshotContainers.filter(n => n)
        if (cleanSnapshotContainers.length !== snap.snapshotContainers.length) {
            snap.snapshotContainers = cleanSnapshotContainers
        }
        // Delete items in snapshot that are no longer in items
        for (let container of snap.snapshotContainers) {
            container.items = container.items.filter(n => this.props.real.items.find(i => i._id === n))
        }
        // Saving to snapshotContainers
        this.props.snapshotSetContainers(snapshotId, snap.snapshotContainers);
    }

    getSnapshot = (snapshotId) => {
        return this.props.real.snapshots.find(x => x._id === snapshotId)
    }

    getUnassignedItems = (snapshotId) => {
        const snap = this.getSnapshot(snapshotId)
        if (typeof snap === "undefined") {
            return []
        } else {
            return snap.unassigned
        }
    }

    render () {
        const { classes } = this.props;

        const unassigned_items = this.getUnassignedItems(this.props.snapshotId)
        return (
            <div className={classes.snapshotBody}>
                <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                    <Grid container spacing={8}>
                        <Grid item xs={5} sm={4} md={3} lg={2}>
                            <ItemCollection 
                                items={this.props.real.items} 
                                unsnapshot_items={unassigned_items} 
                                snapshotId={this.props.snapshotId} />   
                        </Grid>
                        <Grid item xs={7} sm={8} md={9} lg={10}>
                            <ContainerCollection 
                                snapshot={this.getSnapshot(this.props.snapshotId)} 
                                containers={this.props.real.containers} 
                                items={this.props.real.items} />
                        </Grid>
                    </Grid>
                </DragDropContext>
            </div>
            
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { real, snapshotDnd } = state
    return { real, snapshotDnd }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveArrangementState: () => {
            dispatch(saveArrangementState());
        },
        setUnassignedItems: (snapshotId, unassigned) => {
            dispatch(setUnassignedItems(snapshotId, unassigned));
        },
        bulkSetUnassignedItems: (snapshotId, unassigned) => {
            dispatch(bulkSetUnassignedItems(snapshotId, unassigned))
        },
        bulkSetContainerItems: (snapshotId, containerId, items) => {
            dispatch(bulkSetContainerItems(snapshotId, containerId, items))
        },
        setContainerItems: (snapshotId, containerId, items) => {
            dispatch(setContainerItems(snapshotId, containerId, items));
        },
        snapshotSetContainers: (snapshotId, snapshotContainers) => {
            dispatch(snapshotSetContainers(snapshotId, snapshotContainers));
        },
        snapshotDndReset: () => {
            dispatch(snapshotDndReset());
        },
        snapshotDndSetDragItem: (itemId) => {
            dispatch(snapshotDndSetDragItem(itemId));
        },
        snapshotDndUnselectItems: () => {
            dispatch(snapshotDndUnselectItems());
        }
    }
}

Snapshot.propTypes = {
    snapshotId: PropTypes.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(Snapshot))