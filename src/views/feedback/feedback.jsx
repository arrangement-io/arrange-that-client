import React, { Component } from 'react'
import { Paper, Typography, Button } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        margin: 16,
    },
    feedbackButton: {
        margin: 16,
    }
};

class Feedback extends Component {
    render = () => {
        const { classes } = this.props;
        return (
            <main className={classes.root}>
                <Button className={classes.feedbackButton} target="_blank" href="https://forms.gle/H9wexvFJAYjcJ1vV8" color='primary' variant="contained">
                    Feedback Form
                </Button>
                <Typography variant="headline" component="h3">
                    Features planned:
                </Typography>
                <Typography variant="body1">
                    - Adding notes to containers
                </Typography>
                <Typography variant="body1">
                    - Adding global stats to People and Spaces
                </Typography>
                <Typography variant="body1">
                    - Being able to group people
                </Typography>
                <Typography variant="body1">
                    - List view of people
                </Typography>
            </main>
        )
    }
}

export default withStyles(styles)(Feedback)