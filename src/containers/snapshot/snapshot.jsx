import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Grid } from '@material-ui/core'
import ItemCollection from 'containers/itemCollection/itemCollection'
import ContainerCollection from 'containers/containerCollection/containerCollection'
import { DragDropContext } from 'react-beautiful-dnd'
import { setRealData, setUnassignedItems, setContainerItems } from 'actions/real/real'
import { snapshotSetContainers } from 'actions/snapshot/snapshot'
import { reorder, move, getSnapshotContainer } from 'utils'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    snapshotBody: {
        margin: "10px"
    }
});

class Snapshot extends Component {
    componentDidMount () {
        this.healSnapshotContainers(this.props.snapshotId)
        this.healUnassignedItems(this.props.snapshotId)
    }

    onDragEnd = (result) => {
        const { source, destination, type } = result
        const snapshot = this.getSnapshot(this.props.snapshotId)
        if (!destination) { // dropped outside the list
            return
        }
        if (type === "item") {
            if (source.droppableId === destination.droppableId) { // dropped in same list
                let items = []
                if (source.droppableId === 'itemcollection') { // dropped in items' list, only reorder the items in list
                    items = snapshot.unassigned
                    items = reorder(
                        items,
                        source.index,
                        destination.index
                    )
                    this.props.setUnassignedItems(this.props.snapshotId, items)
                } else { // dropped in a container, only reorder the items in a container
                    items = getSnapshotContainer(snapshot, source.droppableId).items
                    items = reorder(
                        items,
                        source.index,
                        destination.index
                    )
                    this.props.setContainerItems(this.props.snapshotId, source.droppableId, items)
                }
            } else { // dropped in other list
                let result
                if (source.droppableId === 'itemcollection') { // dropped in a container from items' list, move
                    result = move(
                        snapshot.unassigned,
                        getSnapshotContainer(snapshot, destination.droppableId).items,
                        source,
                        destination
                    )
                    this.props.setUnassignedItems(this.props.snapshotId, result['source'])
                    this.props.setContainerItems(this.props.snapshotId, destination.droppableId, result['destination'])
                } else if (destination.droppableId === 'itemcollection') { // dropped in items' list from a container, move item from a container to items' list
                    result = move(
                        getSnapshotContainer(snapshot, source.droppableId).items,
                        snapshot.unassigned,
                        source,
                        destination
                    )
                    this.props.setContainerItems(this.props.snapshotId, source.droppableId, result['source'])
                    this.props.setUnassignedItems(this.props.snapshotId, result['destination'])
                } else { // dropped in a container from another container, move item from a container to another container
                    result = move(
                        getSnapshotContainer(snapshot, source.droppableId).items,
                        getSnapshotContainer(snapshot, destination.droppableId).items,
                        source,
                        destination
                    )
                    this.props.setContainerItems(this.props.snapshotId, source.droppableId, result['source'])
                    this.props.setContainerItems(this.props.snapshotId, destination.droppableId, result['destination'])
                }
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
        this.props.setRealData(this.props.real);
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

    getDragItemColor(sourceId, destId) {
        return 'white'
    }

    render () {
        const { classes } = this.props;

        const unassigned_items = this.getUnassignedItems(this.props.snapshotId)
        return (
            <div className={classes.snapshotBody}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Grid container spacing={8}>
                        <Grid item xs={5} sm={4} md={3} lg={2}>
                            <ItemCollection 
                                items={this.props.real.items} 
                                unsnapshot_items={unassigned_items} 
                                getDragItemColor={this.getDragItemColor} />   
                        </Grid>
                        <Grid item xs={7} sm={8} md={9} lg={10}>
                            <ContainerCollection 
                                snapshot={this.getSnapshot(this.props.snapshotId)} 
                                containers={this.props.real.containers} 
                                items={this.props.real.items} 
                                getDragItemColor={this.getDragItemColor} />
                        </Grid>
                    </Grid>
                </DragDropContext>
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
            dispatch(setRealData(data));
        },
        setUnassignedItems: (snapshotId, unassigned) => {
            dispatch(setUnassignedItems(snapshotId, unassigned));
        },
        setContainerItems: (snapshotId, containerId, items) => {
            dispatch(setContainerItems(snapshotId, containerId, items));
        },
        snapshotSetContainers: (snapshotId, snapshotContainers) => {
            dispatch(snapshotSetContainers(snapshotId, snapshotContainers));
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