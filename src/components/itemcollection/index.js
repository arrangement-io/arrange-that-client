import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'

import Item from 'components/item'

export class ItemCollection extends Component {
  render () {
    return (
      <div className="itemcollection">
        <Grid container spacing={24}>
          {
            this.props.items.map((item) => {
              return (
                <Grid item xs={12} key={item._id}>
                  <Item item={item} />
                </Grid>
              )
            })
          }
        </Grid>
      </div>
    )
  }
}

ItemCollection.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  }))
}

export default ItemCollection