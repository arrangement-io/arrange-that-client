import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'

export class Item extends Component {
  render () {
    return (
      <div className="item">
        <Typography variant="headline" align="center">
          {this.props.item.name}
        </Typography>
      </div>
    )
  }
}

Item.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  })
}

export default Item