import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'

import Item from 'components/item'

export class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: []
    }

    this.getItems = this.getItems.bind(this)
  }

  getItems (items, containerId) {
    let stateitems = []
    for (var itemId in this.props.snapshot.snapshot[containerId]) {
      const item = items.find(ele => ele._id === this.props.snapshot.snapshot[containerId][itemId])
      stateitems.push(item)
    }
    this.setState({
      items: stateitems
    })
  }

  componentDidMount () {
    this.getItems(this.props.items, this.props.container._id)
  }

  render () {
    return (
      <div className="container">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="headline" align="center">
              {this.props.container.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div className="container__items">
              <Grid container spacing={24}>
                {
                  this.state.items.map((item) => {
                    if (typeof item !== 'undefined')
                      return (
                        <Grid item xs={12} key={item._id}>
                          <Item item={item} />
                        </Grid>
                      )
                  })
                }
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
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
  })
}

export default Container