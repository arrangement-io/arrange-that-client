import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, Typography } from '@material-ui/core'
import MoreMenu from 'components/moremenu/moremenu'

import { Draggable } from 'react-beautiful-dnd'
import { withStyles } from '@material-ui/core/styles'

import { getItemStyle } from 'utils'

const styles = theme => ({
    card: {
        maxHeight: 40
    },
    cardHeader: {
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10
    }
})

export class Item extends Component {
    handleItemClick = option => {
        if (option === 'Delete from all snapshots') {
            this.props.deleteItem(this.props.item._id)
        }
    }

    render () {
        const { classes } = this.props;

        const options = [
            'Delete from all snapshots'
        ]
        
        return (
            <Draggable
                key={this.props.item._id}
                draggableId={this.props.item._id}
                index={this.props.index}
            >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            this.props.getDragItemColor(this.props.containerId, snapshot.draggingOver)
                        )}
                    >
                        <Card className={classes.card} raised={snapshot.isDragging}>
                            <CardHeader
                                className={classes.cardHeader}
                                title={
                                    <Typography variant="body1" align="left">
                                        {this.props.item.name}
                                    </Typography>
                                }
                                action={<MoreMenu options = {options} handleItemClick = {this.handleItemClick} />}
                            />
                        </Card>
                    </div>
                )}
            </Draggable>
        )
    }
}

Item.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    }),
    deleteItem: PropTypes.func,
    getDragItemColor: PropTypes.func,
    containerId: PropTypes.string
}

export default withStyles(styles)(Item)