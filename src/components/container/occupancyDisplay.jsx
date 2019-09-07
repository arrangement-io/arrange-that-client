import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Warning from '@material-ui/icons/Warning'
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing(1),
    },
});

/**
 * Displays the occupancy of the space as a fraction.
 */
export class OccupancyDisplay extends Component {
    isOverOccupancy = () => {
        return this.props.count > this.props.total;
    }

    render = () => {
        const { classes } = this.props
        const color = this.isOverOccupancy() ? "secondary" : "default"
        const label = this.isOverOccupancy() ? (<Warning/>) : this.props.count + "/" + this.props.total
        const chip = this.isOverOccupancy() 
            ? ( <Tooltip title="Over the size limit" placement="left">
                <Chip 
                    style={this.props.style} 
                    label={label} 
                    className={classes.chip} 
                    color={color} />
            </Tooltip>)
            :   <Chip 
                style={this.props.style} 
                label={label} 
                className={classes.chip} 
                color={color} />
        return (
            <div>
                {chip}
            </div>
        )
    }
}

OccupancyDisplay.propTypes = {
    count: PropTypes.number,
    total: PropTypes.number,
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(OccupancyDisplay)