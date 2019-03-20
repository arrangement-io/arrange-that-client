import React, { Component } from 'react'

import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import { Grid, Typography, Snackbar } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import Item from 'components/item/item'
import EditItem from 'components/editItem/editItem'

import { addItem, deleteItem } from 'actions/item/item'

import { Droppable } from 'react-beautiful-dnd'

import { uuid, getListStyle } from 'utils'

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

        this.addEditItem = this.addEditItem.bind(this)
        this.displayEditItem = this.displayEditItem.bind(this)
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
            isAlert: false
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
            //TODO Need to double check whether this logic of interacting with other functions is correct
            const item = {
                _id: uuid('item'),
                name: itemName,
                size: 1
            }
    
            // Prevent the addition of an empty item, null item, or all whitespace item
            if (item.name === null || item.name.match(/^\s*$/) !== null) {
                continue;
            }

            const item1 = this.props.real.items.find(ele => ele._id === item._id)
            const item2 = this.props.real.items.find(ele => ele.name === item.name)
            // Check for duplicates. In this case, duplicates are not found, so add the item.
            if (typeof item1 === 'undefined' && typeof item2 === 'undefined') {
                this.setState({
                    isEdit: false,
                    name: '',
                    _id: '',
                    size: 1,
                    isAlert: false
                })
    
                this.props.addItem(item)
            } 
        }
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 1,
            isAlert: false
        })
    }

    handleEditItemSubmit () {
        const item = {
            _id: this.state._id,
            name: this.state.name,
            size: this.state.size
        }

        // Prevent the addition of an empty item, null item, or all whitespace item
        if (item.name === null || item.name.match(/^\s*$/) !== null) {
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 1,
                isAlert: false
            })
            return;
        }

        const item1 = this.props.real.items.find(ele => ele._id === this.state._id)
        const item2 = this.props.real.items.find(ele => ele.name === this.state.name)
        // Check for duplicates. In this case, duplicates are not found, so add the item.
        if (typeof item1 === 'undefined' && typeof item2 === 'undefined') {
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 1,
                isAlert: false
            })
  
            this.props.addItem(item)
        } else {
            // In this case, there is a duplicate, so we send an alert
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 1,
                isAlert: true
            })
            // this.setState({
            //     ...this.state,
            //     isAlert: true
            // })
        }
    }

    handleEditItemEscKey () {
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 1,
            isAlert: false
        })
    }

    handleClose = (event, reason) => {
        this.setState({
            ...this.state,
            isAlert: false
        });
    };

    displayEditItem () {
        if (this.state.isEdit) {
            return (
                <Grid item xs={12}>
                    <EditItem 
                        name={this.state.name}
                        handleChange={this.handleEditItemChange}
                        handleEnter={this.handleEditItemSubmit}
                        handleEsc={this.handleEditItemEscKey}
                        handlePaste={this.handleEditItemPaste}
                    />
                </Grid>
            )
        }
    }

    //TODO The snackbar alert seems to hide itself prematurely on click away from a duplicated item.
    render () {
        return (
            <div>
                <Droppable droppableId="itemcollection">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            <div className="itemcollection">
                                <Grid container spacing={0}>
                                    {
                                        this.props.unsnapshot_items.map((id, index) => {
                                            return (
                                                <Grid item xs = {12} key = {id}>
                                                    <Item item = {this.props.items.find(ele => ele._id === id)} deleteItem = {this.props.deleteItem} index={index} getDragItemColor={this.props.getDragItemColor} containerId="itemcollection" />
                                                </Grid>
                                            )
                                        })
                                    }
                                    { this.displayEditItem() }
                                    <Grid item xs={12}>
                                        <div className="item" onClick={this.addEditItem}>
                                            <Typography variant="headline" align="center">+</Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.isAlert}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'item-duplicated',
                    }}
                    message={<span id="item-duplicated">Item duplicated</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className=""
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (ItemCollection)