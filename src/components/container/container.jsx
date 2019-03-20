import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, Card, CardHeader, CardContent } from '@material-ui/core'
import MoreMenu from 'components/moremenu/moremenu'

import Item from 'components/item/item'
import OccupancyDisplay from 'components/container/occupancyDisplay'

import { withStyles } from '@material-ui/core/styles'
import { getListStyle, getSnapshotContainer } from 'utils'
import { Droppable } from 'react-beautiful-dnd'

const styles = theme => ({
    card: {
        background:"#fcfcfc"
    },
    cardHeader: {
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10
    },
    cardContent: {
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10
    }
})

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
        if (option === 'Delete from all snapshots') {
            this.props.deleteContainer(this.props.container._id)
        }
    }

    render () {
        const { classes } = this.props
        const options = [
            'Delete from all snapshots'
        ]
        const items = this.getItems(this.props.items, this.props.container._id)

        return (
            <Droppable droppableId={this.props.container._id} ignoreContainerClipping={true}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                        <Card className={classes.card}>
                            <CardHeader
                                className={classes.cardHeader}
                                title={
                                    <Typography variant="body1" align="left">
                                        <b>{this.props.container.name}</b>
                                    </Typography>
                                }
                                action={<MoreMenu options = {options} handleItemClick = {this.handleItemClick} />}
                                avatar={<OccupancyDisplay total={this.props.container.size} count={items.length} />}
                            />
                            <CardContent className={classes.cardContent}>
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
                                {provided.placeholder}
                            </CardContent>
                        </Card>
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

export default withStyles(styles)(Container)