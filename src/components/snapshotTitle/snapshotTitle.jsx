import React, { Component } from 'react'

import MoreMenu from 'components/moremenu/moremenu'

import PropTypes from 'prop-types'
import { Typography, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'

const ENTER_KEY = 13;
const ESC_KEY = 27;

const styles = theme => ({
    root: {
        display: "flex",
        justifyContent: "space-between"
    },
    snapshotTitle: {
        flexGrow: 1,
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    snapshotMenu: {
        position: "relative",
        bottom: "12px"
    },
    editSnapshotTitle: {
        position: "relative",
        bottom: "12px"
    }
})

class SnapshotTitle extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isEdit: false,
            newName: props.snapshot.name
        }
    }

    handleItemClick = (option) => {
        if (option === 'Delete') {
            this.props.onDelete(this.props.snapshot._id)
        }
        else if (option === "Clone") {
            this.props.onClone(this.props.snapshot._id)
        }
        else if (option === 'Edit') {
            this.setState({
                ...this.state,
                isEdit: true
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            ...this.state,
            newName: e.target.value
        })
    }

    handleKeyDown = (e) => {
        switch (e.keyCode) {
            case ENTER_KEY:
                this.handleEnter(this.state.newName)
                break;
            case ESC_KEY:
                this.setState({
                    ...this.state,
                    isEdit: false,
                    newName: this.props.snapshot.name
                })
                break;
            default:
                break;
        }    
    }

    handleEnter = (name) => {
        this.props.onSave(this.props.snapshot._id, name)
        this.setState({
            ...this.state,
            isEdit: false
        })
    }

    render = () => {
        const { classes } = this.props
        const options = [
            'Edit',
            'Clone',
            'Delete'
        ]

        const title = (
            <div className={classes.root}>
                <Typography className={classes.snapshotTitle} variant="body1">{this.props.snapshot.name}</Typography>
                <div className={classes.snapshotMenu}>
                    <MoreMenu options = {options} handleItemClick = {this.handleItemClick} />
                </div>
            </div>
        )

        const editTitle = (
            <div className={classes.editSnapshotTitle}>
                <TextField
                    autoFocus={true}
                    defaultValue={this.props.snapshot.name}
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange}
                    onBlur={() => this.handleEnter(this.state.newName)}
                    margin="dense"
                />
            </div>
        )

        return this.state.isEdit ? editTitle : title;
    }
}

SnapshotTitle.propTypes = {
    snapshot: PropTypes.object,
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
    onClone: PropTypes.func
}

export default withStyles(styles)(SnapshotTitle)