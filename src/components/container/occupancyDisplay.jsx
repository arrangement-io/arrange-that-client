import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

const styles = theme => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    chip: {
      margin: theme.spacing.unit,
    },
  });

/**
 * Displays the occupancy of the space as a fraction.
 */
export class OccupancyDisplay extends Component {
    render = () => {
        const { classes } = this.props
        const color = (this.props.count > this.props.total) ? "secondary" : "default"
        return (
            <Chip label={this.props.count + "/" + this.props.total} className={classes.chip} color={color} />
        )
    }
}

OccupancyDisplay.propTypes = {
    count: PropTypes.number,
    total: PropTypes.number,
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(OccupancyDisplay)