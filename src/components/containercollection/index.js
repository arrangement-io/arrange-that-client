import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'

import Container from 'components/container'

export class ContainerCollection extends Component {
  render () {
    return (
      <div className="containercollection">
        <Grid container spacing={24}>
          {
            this.props.containers.map((container) => {
              return (
                <Grid item xs={12} sm={4} md={3} key={container._id}>
                  <Container container={container} snapshots={this.props.snapshots} items={this.props.items} />
                </Grid>
              )
            })
          }
        </Grid>
      </div>
    )
  }
}

ContainerCollection.propTypes = {
  snapshots: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    snapshot: PropTypes.object
  })).isRequired,
  containers: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  })).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  })).isRequired
}

export default ContainerCollection