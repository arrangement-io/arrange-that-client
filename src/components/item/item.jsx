import React, { Component } from 'react'

import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import { Card, CardHeader, Typography } from '@material-ui/core'
import MoreMenu from 'components/moremenu/moremenu'

import { Draggable } from 'react-beautiful-dnd'
import { withStyles } from '@material-ui/core/styles'

import { renameItem } from 'actions/item/item'

import { getItemStyle } from 'utils'
import EditItem from 'components/editItem/editItem'

const styles = theme => ({
    card: {
        maxHeight: 40
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
        if (option === 'Delete from all snapshots') {
            this.props.deleteItem(this.props.item._id)
        }
        else if (option === 'Edit') {
            this.setState({
                ...this.state,
                isEdit: true,
                name: this.props.item.name,
            })
        }
    }

    handleEditItemSubmit = () => {

        this.props.renameItem({
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

    render = () => {
        const { classes } = this.props;

        const options = [
            'Edit',
            'Delete from all snapshots'
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
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            this.props.getDragItemColor(this.props.containerId, snapshot.draggingOver)
                        )}
                    >
                        <Card className={classes.card} raised={snapshot.isDragging}>
                            <CardHeader
                                className={classes.cardHeader}
                                title={
                                    <Typography variant="body1" align="left">
                                        {this.props.item.name}
                                    </Typography>
                                }
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
    deleteItem: PropTypes.func,
    getDragItemColor: PropTypes.func,
    containerId: PropTypes.string
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
        renameItem: (item) => {
            dispatch(renameItem(item))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(Item))