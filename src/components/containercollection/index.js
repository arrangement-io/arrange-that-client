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
                  <Container container={container} snapshot={this.props.snapshot} items={this.props.items} />
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
  snapshot: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    snapshot: PropTypes.object
  }),
  containers: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  })),
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  }))
}

export default ContainerCollection