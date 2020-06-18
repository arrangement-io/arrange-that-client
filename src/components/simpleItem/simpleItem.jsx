import React, { PureComponent } from 'react';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { Card, CardHeader, Typography, Badge } from '@material-ui/core';

import MoreMenu from 'components/moremenu/moremenu';

import { Draggable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';

import { updateItem, deleteItem } from 'actions/item/item';
import { snapshotDndToggleSelection,
    snapshotDndToggleSelectionInGroup,
    snapshotDndMultiSelectTo } from 'actions/snapshotDndActions';

import EditItem from 'components/editItem/editItem';
import { green } from '@material-ui/core/colors';

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const PRIMARY_BUTTON = 0;
const keyCodes = {
    enter: 13,
    escape: 27,
    arrowDown: 40,
    arrowUp: 38,
    tab: 9,
};

const styles = () => ({
    card: {
        marginBottom: 1,
    },
    cardSelected: {
        backgroundColor: '#ddd',
    },
    cardGhosting: {
        opacity: 0.3,
    },
    cardHeader: {
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10,
    },
    cardTitle: {
        lineHeight: '18px',
        marginTop: '1px',
    },
    removeShrink: {
        display: 'inline-block',
        width: '100%',
    },
    assigned: {
        color: 'green',
        textDecoration: 'line-through',
    },
    unassigned: {
        color: 'red',
    },
});

export class SimpleItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            name: '',
        };
    }
    // Using onClick as it will be correctly
    // preventing if there was a drag
    onClick = (event) => {
        if (event.defaultPrevented) {
            return;
        }

        if (event.button !== PRIMARY_BUTTON) {
            return;
        }

        // marking the event as used
        event.preventDefault();

        this.performAction(event);
    };

    onKeyDown = (event, provided, snapshot) => {
        if (provided.dragHandleProps) {
            provided.dragHandleProps.onKeyDown(event);
        }

        if (event.defaultPrevented) {
            return;
        }

        if (snapshot.isDragging) {
            return;
        }

        if (event.keyCode !== keyCodes.enter) {
            return;
        }

        // we are using the event for selection
        event.preventDefault();

        this.performAction(event);
    };

    render = () => {
        const { classes } = this.props;
        const cardClass = classes.card;

        return (
            <Card className={cardClass}>
                <CardHeader
                    className={`${classes.cardHeader} ${this.props.assigned ? classes.assigned : classes.unassigned}`}
                    title={
                        <div>
                            <Typography variant="body1" align="left" className={classes.cardTitle}>
                                { this.props.item.name }
                            </Typography>
                        </div>
                    }
                    onDoubleClick={this.handleItemDoubleClick}
                />
            </Card>
        );
    }
}

SimpleItem.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number,
    }),
    index: PropTypes.number,
    containerId: PropTypes.string,
    snapshotId: PropTypes.string,
};

export default withStyles(styles)(SimpleItem);
