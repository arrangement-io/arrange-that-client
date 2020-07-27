import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import PropTypes from 'prop-types';
import { Grid, Typography, Card, CardHeader, CardContent, CardActions, Button, Divider, Modal } from '@material-ui/core';

import Item from 'components/item/item';
import SimpleItem from 'components/simpleItem/simpleItem';
import EditItem from 'components/editItem/editItem';

import AddPersonModal from 'components/addPersonModal/addPersonModal';

import { addItem } from 'actions/item/item';

import { Droppable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';

import { uuid, validateName, checkDuplicate } from 'utils';
import { withSnackbar } from 'notistack';

const UNASSIGNED = 'unassigned';

const styles = () => ({
    card: {
        background: '#fafafa',
    },
    cardHeader: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 0,
        paddingRight: 10,
    },
    cardContent: {
        maxHeight: 'calc(100vh - 341px)',
        overflow: 'scroll',
    },
    addPersonModal: {
        position: 'absolute',
        width: "400px",
        border: '2px solid #000',
    },
});

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

export class ItemCollection extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            name: '',
            _id: '',
            size: 1,
            isAlert: false,
        };

        this.addEditItem = this.addEditItem.bind(this);
        this.handleEditItemChange = this.handleEditItemChange.bind(this);
        this.handleEditItemSubmit = this.handleEditItemSubmit.bind(this);
        this.handleEditItemEscKey = this.handleEditItemEscKey.bind(this);
    }

    addEditItem() {
        this.setState({
            isEdit: true,
            _id: uuid('item'),
            name: '',
            size: 1,
        });
    }

    handleEditItemChange(e) {
        this.setState({
            ...this.state,
            name: e.target.value,
        });
    }

    // This function splits a string by tabs/newlines and individually
    // submits each item and then adds another edit item.
    handleEditItemPaste = (pasteString) => {
        console.log("blaaaarrrrgh: ItemCollection -> handleEditItemPaste -> handleEditItemPaste")
        // TODO does this work on Windows? Does it need to check for carriage return?
        const splitStrings = pasteString.split(/[\t\n]/);

        for (const itemName of splitStrings) {
            const item = {
                _id: uuid('item'),
                name: itemName,
                size: 1,
            };

            // Prevent the addition of an empty item, null item, or all whitespace item
            if (!validateName(item.name)) {
                continue;
            }

            // Check for duplicates. In this case, duplicates are not found, so add the item.
            if (checkDuplicate(item, Object.values(this.props.real.items))) {
                this.setState({
                    isEdit: false,
                    name: '',
                    _id: '',
                    size: 1,
                });

                this.props.addItem(item);
            } else { // duplicates are found, notify user through snackbar
                this.props.enqueueSnackbar(`Duplicated name: ${itemName}`);
            }
        }
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 1,
        });
    }

    handleEditItemSubmit(event) {
        console.log("ItemCollection -> handleEditItemSubmit -> handleEditItemSubmit");
        
        const item = {
            _id: this.state._id,
            name: this.state.name,
            size: this.state.size,
        };

        // Prevent the addition of an empty item, null item, or all whitespace item
        if (!validateName(item.name)) {
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 1,
            });
            return;
        }

        // Check for duplicates. In this case, duplicates are not found, so add the item.
        if (checkDuplicate(item, Object.values(this.props.real.items))) {
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 1,
            });

            this.props.addItem(item);
            // If user presses enter, add another item
            if (event === 'Enter') {
                this.setState({
                    isEdit: true,
                    _id: uuid('item'),
                });
            }
        } else {
            // In this case, there is a duplicate, so we send an alert
            this.props.enqueueSnackbar(`Duplicated name: ${item.name}`);
        }
    }

    handleEditItemEscKey() {
        console.log("blaaaarrrrgh: ItemCollection -> handleEditItemEscKey -> handleEditItemEscKey")
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 1,
        });
    }

    getEditItemProps() {
        return {
            handleChange: this.handleEditItemChange,
            handleEnter: this.handleEditItemSubmit,
            handleEsc: this.handleEditItemEscKey,
            handlePaste: this.handleEditItemPaste,
        };
    }

    // TODO The snackbar alert seems to hide itself prematurely on click away from a duplicated item.
    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card} style={{ maxHeight: '500px', overflow: 'scroll' }}>
                <CardHeader className={classes.cardHeader} title="People"/>
                <CardContent>Unassigned: {this.props.unsnapshot_items.length}/{Object.keys(this.props.items).length}</CardContent>
                <Droppable droppableId={UNASSIGNED} type={'item'}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                            <CardContent className={classes.cardContent}>
                                <Grid container spacing={0}>
                                    {
                                        this.props.unsnapshot_items.map((id, index) => {
                                            const item = this.props.items[id];
                                            // Check for null items
                                            if (item) {
                                                return (
                                                    <Grid item xs = {12} key = {id}>
                                                        <Item
                                                            item={item}
                                                            index={index}
                                                            containerId={UNASSIGNED}
                                                            snapshotId={this.props.snapshotId} />
                                                    </Grid>
                                                );
                                            }
                                            console.log('attempted to render null item');
                                        })
                                    }
                                    <Modal open={this.state.isEdit}>
                                        <AddPersonModal
                                            name={this.state.name}
                                            {...this.getEditItemProps()}
                                        />
                                    </Modal>
                                    {provided.placeholder}
                                </Grid>
                            </CardContent>
                        </div>
                    )}
                </Droppable>
                <Grid container style={{ marginTop: '18px' }}>
                    {
                        Object.entries(this.props.items).map((id_item, _) => {
                            let id = id_item[0];
                            let item = id_item[1];

                            const new_id = `roster${id}`;

                            const is_assigned = !this.props.unsnapshot_items.includes(id);
                            
                            if (item) {
                                return (
                                    <Grid item xs = {12} key = {new_id}>
                                        <SimpleItem
                                            item={item}
                                            index={new_id}
                                            containerId={UNASSIGNED}
                                            snapshotId={this.props.snapshotId}
                                            assigned={is_assigned}
                                        />
                                    </Grid>
                                );
                            }
                        })
                    }
                </Grid>
                <CardActions>
                    <Button variant="text" color="default" onClick={this.addEditItem}>
                        <Typography variant="body1" align="left">
                            + add a person
                        </Typography>
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

ItemCollection.propTypes = {
    items: PropTypes.objectOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number,
    })),
    unsnapshot_items: PropTypes.array,
    getDragItemColor: PropTypes.func,
    snapshotId: PropTypes.string,
};

const mapStateToProps = (state) => {
    const {
        real,
    } = state;
    return {
        real,
    };
};

const mapDispatchToProps = dispatch => ({
    addItem: (item) => {
        dispatch(addItem(item));
    },
});

export default withSnackbar(withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ItemCollection))));
