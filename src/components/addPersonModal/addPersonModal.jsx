import React, { PureComponent } from 'react';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { Card, CardHeader, Typography, Badge, TextField } from '@material-ui/core';

import MoreMenu from 'components/moremenu/moremenu';

import { Draggable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';

import { updateItem, deleteItem } from 'actions/item/item';
import { snapshotDndToggleSelection,
    snapshotDndToggleSelectionInGroup,
    snapshotDndMultiSelectTo } from 'actions/snapshotDndActions';

import EditItem from 'components/editItem/editItem';
import { green } from '@material-ui/core/colors';

const styles = () => ({
    paper: {
        position: 'absolute',
        width: 500,
        boxShadow: '5px',

        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    card: {
        padding: '15px',
    },
    lastName: {
        //paddingLeft: '5px',
    },
});

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

export class AddPersonModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            firstName: '',
            lastName: '',
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    handleClick = (event) => {
        //event.preventDefault();
    };

    handleMouseDown = (event) => {
        //event.preventDefault();
    };

    render = () => {
        const { classes } = this.props;
        const cardClass = classes.card;

        return (
            <div onClick={this.handleClick} onMouseDown={this.handleMouseDown} className={classes.paper}>
                <Card className={cardClass}>
                    <CardHeader className={classes.cardHeader} title="Add a Person"/>
                    <Typography variant="h5" align="left">
                        <TextField
                            autoFocus={true}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.props.handleChange}
                            onPaste={this.handlePasteText}
                            value={this.props.firstName}
                            placeholder="First Name"
                            variant="outlined"
                        />
                    </Typography>
                    <Typography variant="h5" align="right">
                        <TextField
                            autoFocus={false}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.props.handleChange}
                            onPaste={this.handlePasteText}
                            value={this.props.lastName}
                            class={classes.lastName}
                            placeholder="Last Name"
                            variant="outlined"
                        />
                    </Typography>
                </Card>
            </div>
        );
    }
}

AddPersonModal.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number,
    }),
    index: PropTypes.number,
    containerId: PropTypes.string,
    snapshotId: PropTypes.string,
};

export default withStyles(styles)(AddPersonModal);
