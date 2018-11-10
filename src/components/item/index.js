import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import MoreMenu from 'components/moremenu'

import { Draggable } from 'react-beautiful-dnd'

import { getItemStyle } from 'utils'

export class Item extends Component {
  handleItemClick = option => {
    if (option === 'Delete') {
      this.props.deleteItem(this.props.item._id)
    }
  }

  render () {
    const options = [
      'Delete'
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
              provided.draggableProps.style
            )}
            className="item"
          >
            <Grid container spacing={24}>
              <Grid item xs={8}>
                <Typography variant="headline" align="center">
                  {this.props.item.name}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <MoreMenu options = {options} handleItemClick = {this.handleItemClick} />
              </Grid>
            </Grid>
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
  deleteItem: PropTypes.func
}

export default Item