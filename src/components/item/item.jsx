import React, { Component } from 'react';

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
import GenderClass from 'components/item/genderClass';

import sample from 'lodash/sample';

const EDIT = 'Edit';
const DELETE_FROM_ALL_SNAPSHOTS = 'Delete from all snapshots';
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
});

export class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            name: '',
        };
        this.handleEditItemChange = this.handleEditItemChange.bind(this);
        this.handleEditItemSubmit = this.handleEditItemSubmit.bind(this);
        this.handleEditItemEscKey = this.handleEditItemEscKey.bind(this);
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

    onTouchEnd = (event) => {
        const {
            item,
            index,
            containerId,
            snapshotDndToggleSelectionInGroup,
        } = this.props;

        if (event.defaultPrevented) {
            return;
        }

        // marking the event as used
        // we would also need to add some extra logic to prevent the click
        // if this element was an anchor
        event.preventDefault();
        const itemInfo = { itemId: item._id, containerId, index };
        snapshotDndToggleSelectionInGroup(itemInfo);
    };

    // Determines if the platform specific toggle selection in group key was used
    wasToggleInSelectionGroupKeyUsed = (event) => {
        const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
        return isUsingWindows ? event.ctrlKey : event.metaKey;
    };

    // Determines if the multiSelect key was used
    wasMultiSelectKeyUsed = event => event.shiftKey;

    performAction = (event) => {
        const {
            item,
            index,
            containerId,
            snapshotDndToggleSelection,
            snapshotDndToggleSelectionInGroup,
            snapshotDndMultiSelectTo,
        } = this.props;

        const itemInfo = { itemId: item._id, containerId, index };
        if (this.wasToggleInSelectionGroupKeyUsed(event)) {
            snapshotDndToggleSelectionInGroup(itemInfo);
            return;
        }

        if (this.wasMultiSelectKeyUsed(event)) {
            snapshotDndMultiSelectTo(itemInfo, this.getSnapshot(this.props.snapshotId));
            // Remove text selection
            document.getSelection().removeAllRanges();
            return;
        }

        snapshotDndToggleSelection(itemInfo);
    };

    isSelected = () => this.props.snapshotDnd.selectedItems.some(x => x.itemId === this.props.item._id)

    isGhosting = isCardSelected => this.props.snapshotDnd.draggingItemId && this.props.snapshotDnd.draggingItemId !== this.props.item._id && isCardSelected

    getSnapshot = snapshotId => this.props.real.snapshots.find(x => x._id === snapshotId)

    handleItemClick = (option) => {
        if (option === DELETE_FROM_ALL_SNAPSHOTS) {
            this.props.deleteItem(this.props.item._id);
        } else if (option === EDIT) {
            this.setState({
                ...this.state,
                isEdit: true,
                name: this.props.item.name,
            });
        }
    }

    handleItemDoubleClick = () => {
        this.setState({
            ...this.state,
            isEdit: true,
            name: this.props.item.name,
        });
    }

    handleEditItemSubmit = () => {
        this.props.updateItem({
            ...this.props.item,
            name: this.state.name,
        });
        this.setState({
            ...this.state,
            isEdit: false,
        });
    }

    handleEditItemChange = (e) => {
        this.setState({
            ...this.state,
            name: e.target.value,
        });
    }

    handleEditItemEscKey = () => {
        this.setState({
            isEdit: false,
        });
    }

    getNote = () => {
        if ('notes' in this.props.item && this.props.item.notes) {
            return this.props.item.notes;
        }
    }

    render = () => {
        const { classes } = this.props;

        const options = [
            EDIT,
            DELETE_FROM_ALL_SNAPSHOTS,
        ];
        const isCardSelected = this.isSelected();
        const isCardGhosting = this.isGhosting(isCardSelected);
        const selectionCount = this.props.snapshotDnd.selectedItems.length;

        const item = (
            <Draggable
                key={this.props.item._id}
                draggableId={this.props.item._id}
                index={this.props.index}
            >
                {(provided, snapshot) => {
                    let cardClass = classes.card;
                    if (isCardSelected || snapshot.isDragging) {
                        cardClass += ` ${classes.cardSelected}`;
                    }
                    if (isCardGhosting) {
                        cardClass += ` ${classes.cardGhosting}`;
                    }
                    return (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={this.onClick}
                            onTouchEnd={this.onTouchEnd}
                            onKeyDown={event =>
                                this.onKeyDown(event, provided, snapshot)
                            }
                        >
                            <Badge
                                className={classes.removeShrink}
                                invisible={!(snapshot.isDragging && selectionCount > 1)}
                                badgeContent={selectionCount}
                                color="secondary" >
                                <Card className={cardClass} raised={snapshot.isDragging}>
                                    <CardHeader
                                        className={classes.cardHeader}
                                        avatar={<GenderClass
                                            gender={sample(['M', 'F', ''])}
                                            color={sample(['red', 'yellow', 'blue', ''])}
                                            clazz={sample(['FR', 'SO', 'JR', 'SR', ''])} />}
                                        title={
                                            <div>
                                                <Typography variant="body1" align="left" className={classes.cardTitle}>
                                                    { this.props.item.name }
                                                </Typography>
                                                <Typography variant="body2" align="left" color="textSecondary">
                                                    { this.props.arrangementSettings.isDisplayNotes ? this.getNote() : '' }
                                                </Typography>
                                            </div>
                                        }
                                        onDoubleClick={this.handleItemDoubleClick}
                                        action={<MoreMenu options = {options} handleItemClick = {this.handleItemClick} />}
                                    />
                                </Card>
                            </Badge>
                        </div>
                    );
                }}
            </Draggable>

        );

        const editItem = (
            <EditItem
                name={this.state.name}
                handleChange={this.handleEditItemChange}
                handleEnter={this.handleEditItemSubmit}
                handleEsc={this.handleEditItemEscKey}
            />
        );

        if (this.state.isEdit) {
            return editItem;
        }

        return item;
    }
}

Item.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number,
    }),
    index: PropTypes.number,
    containerId: PropTypes.string,
    snapshotId: PropTypes.string,
};

const mapStateToProps = (state) => {
    const {
        real,
        arrangementSettings,
        snapshotDnd,
    } = state;
    return {
        real,
        arrangementSettings,
        snapshotDnd,
    };
};

const mapDispatchToProps = dispatch => ({
    updateItem: (item) => {
        dispatch(updateItem(item));
    },
    deleteItem: (item) => {
        dispatch(deleteItem(item));
    },
    snapshotDndToggleSelection: (selectedItem) => {
        dispatch(snapshotDndToggleSelection(selectedItem));
    },
    snapshotDndToggleSelectionInGroup: (selectedItem) => {
        dispatch(snapshotDndToggleSelectionInGroup(selectedItem));
    },
    snapshotDndMultiSelectTo: (selectedItem, snapshot) => {
        dispatch(snapshotDndMultiSelectTo(selectedItem, snapshot));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Item));
