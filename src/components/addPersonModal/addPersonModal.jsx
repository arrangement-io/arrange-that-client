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

const ENTER = 'Enter';
const KEYDOWN = 'keydown';
const MOUSEDOWN = 'mousedown';
const ESCAPE = 27;

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
        // paddingLeft: '5px',
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

    state = {
        firstName: this.props.firstName,
        lastName: this.props.lastName,
    };

    handleFirstChange = (event) => {
        this.setState({
            firstName: event.target.value,
        });
    };

    handleLastChange = (event) => {
        this.setState({
            lastName: event.target.value,
        });
    };

    handleKeyPress = (event) => {
        if (event.key === ENTER) {
            this.setState({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
            });
            this.props.handleEnter(this.state.firstName + " " + this.state.lastName);
        }
    };

    handleClick = (event) => {
        // event.preventDefault();
    };

    handleMouseDown = (event) => {
        // event.preventDefault();
    };

    escFunction = (event) => {
        if (event.keyCode === ESCAPE) {
            this.props.handleEsc();
        }
    };

    componentDidMount() {
        document.addEventListener(KEYDOWN, this.escFunction, false);
        document.addEventListener(MOUSEDOWN, this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener(KEYDOWN, this.escFunction, false);
        document.removeEventListener(MOUSEDOWN, this.handleClick, false);
    }

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
                            onChange={this.handleFirstChange}
                            onPaste={this.handlePasteText}
                            value={this.state.firstName}
                            placeholder="First Name"
                            variant="outlined"
                        />
                    </Typography>
                    <Typography variant="h5" align="right">
                        <TextField
                            autoFocus={false}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.handleLastChange}
                            onPaste={this.handlePasteText}
                            value={this.state.lastName}
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
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    index: PropTypes.number,
    containerId: PropTypes.string,
    snapshotId: PropTypes.string,
    handleEsc: PropTypes.func,
    handleEnter: PropTypes.func,
};

export default withStyles(styles)(AddPersonModal);
