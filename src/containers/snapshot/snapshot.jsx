import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Grid, Typography } from '@material-ui/core'
import ItemCollection from 'containers/itemCollection/itemCollection'
import ContainerCollection from 'containers/containerCollection/containerCollection'
import { DragDropContext } from 'react-beautiful-dnd'
import { setRealData, setUnassigned, setSnapshot } from 'actions/real/real'
import { reorder, move } from 'utils'

class Snapshot extends Component {
    componentDidMount () {
        this.healUnassignedItems(this.props.snapshotId)
    }

    onDragEnd = result => {
        const { source, destination } = result
        if (!destination) { // dropped outside the list
            return
        }
        
        if (source.droppableId === destination.droppableId) { // dropped in same list
            let items = []
            if (source.droppableId === 'itemcollection') { // dropped in items' list, only reorder the items in list
                items = this.props.real.snapshots[0].unassigned
                items = reorder(
                    items,
                    source.index,
                    destination.index
                )
                this.props.setUnassigned(items)
            } else { // dropped in a container, only reorder the items in a container
                items = this.props.real.snapshots[0].snapshot[source.droppableId]
                items = reorder(
                    items,
                    source.index,
                    destination.index
                )
                this.props.setSnapshot({id: source.droppableId, items: items})
            }
        } else { // dropped in other list
            let result
            if (source.droppableId === 'itemcollection') { // dropped in a container from items' list, move
                result = move(
                    this.props.real.snapshots[0].unassigned,
                    this.props.real.snapshots[0].snapshot[destination.droppableId],
                    source,
                    destination
                )
                this.props.setUnassigned(result['source'])
                this.props.setSnapshot({id: destination.droppableId, items: result['destination']})
            } else if (destination.droppableId === 'itemcollection') { // dropped in items' list from a container, move item from a container to items' list
                result = move(
                    this.props.real.snapshots[0].snapshot[source.droppableId],
                    this.props.real.snapshots[0].unassigned,
                    source,
                    destination
                )
                this.props.setSnapshot({id: source.droppableId, items: result['source']})
                this.props.setUnassigned(result['destination'])
            } else { // dropped in a container from another container, move item from a container to another container
                result = move(
                    this.props.real.snapshots[0].snapshot[source.droppableId],
                    this.props.real.snapshots[0].snapshot[destination.droppableId],
                    source,
                    destination
                )
                this.props.setSnapshot({id: source.droppableId, items: result['source']})
                this.props.setSnapshot({id: destination.droppableId, items: result['destination']})
            }
        }
    }

    healUnassignedItems = (snapshotId) => {
        const snap = this.props.real.snapshots.find(x => x._id === snapshotId)
        let clean_unassigned = snap.unassigned.filter(n => n)
        let unassigned_set = new Set(this.props.real.items.map(item => item._id))
        Object.values(snap.snapshot).map(items => items.map(item => unassigned_set.delete(item))) // Retain only unassigned checking the containers for assignment
        clean_unassigned.map(item => unassigned_set.delete(item)) // Removed the items that are already in unassigned.
        // Self healing. If there are missing unassigned items, add them back into unassigned.
        if (unassigned_set.size > 0) {
            console.log("there are some missing unassigned")
            Array.from(unassigned_set).map(item => clean_unassigned.push(item))
            this.props.setUnassigned(clean_unassigned)
        }
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
        const unassigned_items = this.getUnassignedItems(this.props.snapshotId)
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Grid container spacing={8}>
                    <Grid item xs={5} sm={4} md={3} lg={2}>
                        <Typography variant="headline" gutterBottom align="left">
                            People
                        </Typography>
                        <ItemCollection items={this.props.real.items} unsnapshot_items={unassigned_items} getDragItemColor={this.getDragItemColor} />   
                    </Grid>
                    <Grid item xs={7} sm={8} md={9} lg={10}>
                        <Typography variant="headline" gutterBottom align="left">
                            Spaces
                        </Typography>
                        <ContainerCollection snapshot={this.getSnapshot(this.props.snapshotId)} containers={this.props.real.containers} items={this.props.real.items} getDragItemColor={this.getDragItemColor} />
                    </Grid>
                </Grid>
            </DragDropContext>
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
            dispatch(setRealData(data))
        },
        setUnassigned: (data) => {
            dispatch(setUnassigned(data))
        },
        setSnapshot: (data) => {
            dispatch(setSnapshot(data))
        }
    }
}

Snapshot.propTypes = {
    snapshotId: PropTypes.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (Snapshot)