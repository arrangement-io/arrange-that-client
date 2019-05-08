import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import PropTypes from 'prop-types'
import { Grid, Typography, Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core'

import Item from 'components/item/item'
import EditItem from 'components/editItem/editItem'

import { addItem, deleteItem } from 'actions/item/item'

import { Droppable } from 'react-beautiful-dnd'
import { withStyles } from '@material-ui/core/styles'

import { uuid, getListStyle, validateName, checkDuplicate } from 'utils'
import { withSnackbar } from 'notistack';

const styles = theme => ({
    card: {
        background:"#fafafa"
    },
    cardHeader: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 0,
        paddingRight: 10
    }
})

export class ItemCollection extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isEdit: false,
            name: '',
            _id: '',
            size: 1,
            isAlert: false
        }

        this.addEditItem          = this.addEditItem.bind(this)
        this.displayEditItem      = this.displayEditItem.bind(this)
        this.handleEditItemChange = this.handleEditItemChange.bind(this)
        this.handleEditItemSubmit = this.handleEditItemSubmit.bind(this)
        this.handleEditItemEscKey = this.handleEditItemEscKey.bind(this)
    }

    addEditItem () {
        this.setState({
            isEdit: true,
            _id: uuid('item'),
            name: '',
            size: 1,
        })
    }

    handleEditItemChange (e) {
        this.setState({
            ...this.state,
            name: e.target.value
        })
    }

    // This function splits a string by tabs/newlines and individually
    // submits each item and then adds another edit item.
    handleEditItemPaste = (pasteString) => {
        //TODO does this work on Windows? Does it need to check for carriage return?
        var splitStrings = pasteString.split(/[\t\n]/)

        for (let itemName of splitStrings) {
            const item = {
                _id: uuid('item'),
                name: itemName,
                size: 1
            }
    
            // Prevent the addition of an empty item, null item, or all whitespace item
            if (!validateName(item.name)) {
                continue;
            }

            // Check for duplicates. In this case, duplicates are not found, so add the item.
            if (checkDuplicate(item, this.props.real.items)) {
                this.setState({
                    isEdit: false,
                    name: '',
                    _id: '',
                    size: 1,
                })
    
                this.props.addItem(item)
            } else { //duplicates are found, notify user through snackbar
                this.props.enqueueSnackbar('Duplicated name: ' + itemName)
            }
        }
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 1,
        })
    }

    handleEditItemSubmit (event) {
        const item = {
            _id: this.state._id,
            name: this.state.name,
            size: this.state.size
        }

        // Prevent the addition of an empty item, null item, or all whitespace item
        if (!validateName(item.name)) {
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 1,
            })
            return;
        }

        // Check for duplicates. In this case, duplicates are not found, so add the item.
        if (checkDuplicate(item, this.props.real.items)) {
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 1,
            })
  
            this.props.addItem(item)
            // If user presses enter, add another item
            if (event === 'Enter') {
                this.setState({
                    isEdit: true,
                    _id: uuid('item'),
                })
            }
        } else {
            // In this case, there is a duplicate, so we send an alert
            this.props.enqueueSnackbar("Duplicated name: " + item.name)
        }
    }

    handleEditItemEscKey () {
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 1,
        })
    }

    handleClose = (event, reason) => {
        this.setState({
            ...this.state,
        });
    };

    displayEditItem () {
        if (this.state.isEdit) {
            return (
                <Grid item xs={12}>
                    <EditItem 
                        name={this.state.name}
                        {...this.getEditItemProps()}
                    />
                </Grid>
            )
        }
    }

    getEditItemProps () {
        return {
            handleChange: this.handleEditItemChange,
            handleEnter:  this.handleEditItemSubmit,
            handleEsc:    this.handleEditItemEscKey,
            handlePaste:  this.handleEditItemPaste,
        }
    }

    //TODO The snackbar alert seems to hide itself prematurely on click away from a duplicated item.
    render () {
        const { classes } = this.props;

        return (
            <div>
                <Droppable droppableId="itemcollection">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            <Card className={classes.card}>
                                <CardHeader className={classes.cardHeader} title="People"/>
                                <CardContent>Total number of people: {this.props.items.length}</CardContent>
                                <CardContent>Total number of unassigned people: {this.props.unsnapshot_items.length}</CardContent>
                                <CardContent className={classes.CardContent}>
                                    <Grid container spacing={0}>
                                        {
                                            this.props.unsnapshot_items.map((id, index) => {
                                                return (
                                                    <Grid item xs = {12} key = {id}>
                                                        <Item 
                                                            item = {this.props.items.find(ele => ele._id === id)}
                                                            deleteItem = {this.props.deleteItem} 
                                                            index={index} 
                                                            getDragItemColor={this.props.getDragItemColor} 
                                                            containerId="itemcollection"
                                                        />
                                                    </Grid>
                                                )
                                            })
                                        }
                                        { this.displayEditItem() }
                                        {provided.placeholder}
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button variant="text" color="default" onClick={this.addEditItem}>
                                        <Typography variant="body1" align="left">
                                            + add a person
                                        </Typography>
                                    </Button>
                                </CardActions>
                            </Card>
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }
}

ItemCollection.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    })),
    unsnapshot_items: PropTypes.array,
    getDragItemColor: PropTypes.func
}

const mapStateToProps = (state, ownProps) => {
    const {
        real
    } = state
    return {
        real
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addItem: (item) => {
            dispatch(addItem(item))
        },
        deleteItem: (id) => {
            dispatch(deleteItem(id))
        }
    }
}

export default withSnackbar(withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(ItemCollection))))
