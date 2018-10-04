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
  getSnapshot (snapshots, containerId) {
    const result = snapshots.find(item => typeof item.snapshot[containerId] !== 'undefined')
    // console.log(result)
    return result
  }

  getItems (snapshot, items, containerId) {
    if (typeof snapshot !== 'undefined') {
      let stateitems = []
      for (var itemId in snapshot.snapshot[containerId]) {
        const item = items.find(ele => ele._id === snapshot.snapshot[containerId][itemId])
        stateitems.push(item)
      }
      this.setState({
        items: stateitems
      })
    }
  }

  componentDidMount () {
    this.getItems(this.getSnapshot(this.props.snapshots, this.props.container._id), this.props.items, this.props.container._id)
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
  snapshots: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    snapshot: PropTypes.object
  })).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  })).isRequired,
  container: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  }).isRequired
}

export default Container