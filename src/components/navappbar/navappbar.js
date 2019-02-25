import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };

class NavAppBar extends Component {
    render () {
        const classes = this.props.classes
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton> 
                        <Typography variant="h6" color="inherit" align="left" className={classes.grow}>
                            Arrange.Space
                        </Typography>
                        <Button href="/addarrangement" color="inherit">
                            New Arrangement
                        </Button>
                        <Button disabled="true" color="inherit">
                            Arrangements
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

NavAppBar.propTypes = {
    classes: PropTypes.object.isRequired
}


export default withStyles(styles)(NavAppBar)