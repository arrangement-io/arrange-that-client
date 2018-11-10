import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import MoreMenu from 'components/moremenu'

import Item from 'components/item'

import { getListStyle } from 'utils'
import { Droppable } from 'react-beautiful-dnd'

export class Container extends Component {
  getItems (items, containerId) {
    let stateitems = []
    for (var itemId in this.props.snapshot.snapshot[containerId]) {
      const item = items.find(ele => ele._id === this.props.snapshot.snapshot[containerId][itemId])
      stateitems.push(item)
    }

    return stateitems
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

    return (
      <Droppable droppableId={this.props.container._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <div className="container">
              <Grid container spacing={24}>
                <Grid item xs={8}>
                  <Typography variant="headline" align="center">
                    {this.props.container.name}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <MoreMenu options = {options} handleItemClick = {this.handleItemClick} />
                </Grid>
                <Grid item xs={12}>
                  <div className="container__items">
                    <Grid container spacing={24}>
                      {
                        this.getItems(this.props.items, this.props.container._id).map((item, index) => {
                          if (typeof item !== 'undefined')
                            return (
                              <Grid item xs={12} key={item._id}>
                                <Item item={item} deleteItem = {this.props.deleteItem} index={index} />
                              </Grid>
                            )
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
  deleteContainer: PropTypes.func
}

export default Container