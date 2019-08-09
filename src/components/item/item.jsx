import React, { Component } from 'react'

import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import { Card, CardHeader, Typography } from '@material-ui/core'
import MoreMenu from 'components/moremenu/moremenu'

import { Draggable } from 'react-beautiful-dnd'
import { withStyles } from '@material-ui/core/styles'

import { updateItem, deleteItem } from 'actions/item/item'

import EditItem from 'components/editItem/editItem'

const EDIT = 'Edit'
const DELETE_FROM_ALL_SNAPSHOTS = 'Delete from all snapshots'

const styles = theme => ({
    card: {
        marginBottom: 1,
    },
    cardHeader: {
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10
    }
})

export class Item extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isEdit: false,
            name: ''
        }
        this.handleEditItemChange = this.handleEditItemChange.bind(this)
        this.handleEditItemSubmit = this.handleEditItemSubmit.bind(this)
        this.handleEditItemEscKey = this.handleEditItemEscKey.bind(this)
    }

    handleItemClick = option => {
        if (option === DELETE_FROM_ALL_SNAPSHOTS) {
            this.props.deleteItem(this.props.item._id)
        }
        else if (option === EDIT) {
            this.setState({
                ...this.state,
                isEdit: true,
                name: this.props.item.name,
            })
        }
    }

    handleItemDoubleClick = () => {
        this.setState({
            ...this.state,
            isEdit: true,
            name: this.props.item.name,
        })
    }

    handleEditItemSubmit = () => {

        this.props.updateItem({
            ...this.props.item,
            name: this.state.name
        })
        this.setState({
            ...this.state,
            isEdit: false
        })

    }
    
    handleEditItemChange = (e) => {
        this.setState({
            ...this.state,
            name: e.target.value
        })
    }

    handleEditItemEscKey = () => {
        this.setState({
            isEdit: false
        })
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
            DELETE_FROM_ALL_SNAPSHOTS
        ]
        
        const item = (
            <Draggable
                key={this.props.item._id}
                draggableId={this.props.item._id}
                index={this.props.index}

            >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}

                    >
                        <Card className={classes.card} raised={snapshot.isDragging}>
                            <CardHeader
                                className={classes.cardHeader}
                                title={
                                    <div>
                                        <Typography variant="body1" align="left">
                                            { this.props.item.name }
                                        </Typography>
                                        <Typography variant="caption" align="left">
                                            { this.props.arrangementSettings.isDisplayNotes ? this.getNote() : "" }
                                        </Typography>
                                    </div>
                                }
                                onDoubleClick={this.handleItemDoubleClick}
                                action={<MoreMenu options = {options} handleItemClick = {this.handleItemClick} />}
                            />
                        </Card>
                    </div>
                )}
            </Draggable>
        );

        const editItem = (
            <EditItem
                name={this.state.name}
                handleChange={this.handleEditItemChange}
                handleEnter={this.handleEditItemSubmit}
                handleEsc={this.handleEditItemEscKey}
            />
        )
            

        if(!this.state.isEdit){
            return(item)
        }
        else {
            return(editItem)
        }
    }
}

Item.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    }),
    index: PropTypes.number
}

const mapStateToProps = (state, ownProps) => {
    const {
        real,
        arrangementSettings
    } = state
    return {
        real,
        arrangementSettings
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateItem: (item) => {
            dispatch(updateItem(item))
        },
        deleteItem: (item) => {
            dispatch(deleteItem(item))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(Item))