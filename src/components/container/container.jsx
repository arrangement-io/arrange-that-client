import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import MoreMenu from 'components/moremenu/moremenu'

import Item from 'components/item/item'
import OccupancyDisplay from 'components/container/occupancyDisplay'

import { getListStyle, getSnapshotContainer } from 'utils'
import { Droppable } from 'react-beautiful-dnd'

export class Container extends Component {
    getItemIds = (containerId) => {
        return getSnapshotContainer(this.props.snapshot, containerId).items
    }

    getItems = (items, containerId) => {
        const itemsInContainer = []
        for (let itemId of this.getItemIds(containerId)) {
            itemsInContainer.push(items.find(ele => ele._id === itemId))
        }
        return itemsInContainer
    }

    handleItemClick = option => {
        if (option === 'Delete') {
            this.props.deleteContainer(this.props.container._id)
        }
    }

    render () {
        const options = [
            'Delete'
        ]
        const items = this.getItems(this.props.items, this.props.container._id)

        return (
            <Droppable droppableId={this.props.container._id} ignoreContainerClipping={true}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver, this.getItemIds(this.props.container._id).includes(snapshot.draggingOverWith), items.length < this.props.container.size ? false : true)}
                    >
                        <div className="container">
                            <Grid container alignItems="center" spacing={8}>
                                <Grid item xs={3}>
                                    <OccupancyDisplay total={this.props.container.size} count={items.length} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" align="left">
                                        <b>{this.props.container.name}</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <MoreMenu options = {options} handleItemClick = {this.handleItemClick} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={8}>
                                <Grid item xs={12}>
                                    <div className="container__items">
                                        <Grid container spacing={0}>
                                            {
                                                items.map((item, index) => {
                                                    if (typeof item !== 'undefined')
                                                        return (
                                                            <Grid item xs={12} key={item._id}>
                                                                <Item item={item} deleteItem = {this.props.deleteItem} index={index} getDragItemColor={this.props.getDragItemColor} containerId={this.props.container._id} />
                                                            </Grid>
                                                        )
                                                    return {}
                                                })
                                            }
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        )
    }
}

Container.propTypes = {
    snapshot: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        snapshot: PropTypes.object
    }),
    items: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    })),
    container: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    }),
    deleteItem: PropTypes.func,
    deleteContainer: PropTypes.func,
    getDragItemColor: PropTypes.func
}

export default Container