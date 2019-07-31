import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, Card, CardHeader, CardContent } from '@material-ui/core'
import MoreMenu from 'components/moremenu/moremenu'
import { connect } from 'react-redux'

import Item from 'components/item/item'
import EditContainer from 'components/editContainer/editContainer'
import OccupancyDisplay from 'components/container/occupancyDisplay'
import { editContainer, addContainerNote, editContainerNote } from 'actions/container/container'
import EditContainerNote from 'components/container/editContainerNote'

import { withStyles } from '@material-ui/core/styles'
import { getSnapshotContainer } from 'utils'
import { Droppable } from 'react-beautiful-dnd'
import { uuid } from '../../utils';

const EDIT = "Edit"
const DELETE_FROM_ALL_SNAPSHOTS = "Delete from all snapshots"
const ADD_NOTE = "Add Note"

const styles = theme => ({
    card: {
        background:"#fcfcfc"
    },
    cardHeader: {
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10
    },
    cardContent: {
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10
    }
})

export class Container extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isEdit: false,
            editName: this.props.container.name,
            editSize: this.props.container.size
        }
    }

    handleEditContainerNameChange = (e) => {
        this.setState({
            ...this.state,
            editName: e.target.value
        })
    }

    handleEditContainerSizeChange = (e) => {
        let val = parseInt(e.target.value)
        if (isNaN(val)) {
            val = 0
        }
        this.setState({
            ...this.state,
            editSize: val
        })
    }

    handleSaveEditContainer = () => {
        this.setState({
            ...this.state,
            isEdit: false
        })
        this.props.editContainer({
            ...this.props.container,
            name: this.state.editName,
            size: this.state.editSize
        })
    }

    handleEditContainerEscKey = () => {
        this.setState({
            isEdit: false,
            editName: this.props.container.name,
            editSize: this.props.container.size
        })
    }

    getItemIds = (containerId) => {
        return getSnapshotContainer(this.props.snapshot, containerId).items
    }

    getItems = (items, containerId) => {
        const itemsInContainer = []
        for (let itemId of this.getItemIds(containerId)) {
            const item = items.find(ele => ele._id === itemId)
            // Check if item exists
            if (item) {
                itemsInContainer.push(item)
            }
        }
        return itemsInContainer
    }

    handleItemClick = option => {
        if (option === DELETE_FROM_ALL_SNAPSHOTS) {
            this.props.deleteContainer(this.props.container._id)
        }
        else if (option === EDIT) {
            this.setState({
                ...this.state,
                isEdit: true,
                editName: this.props.container.name,
                editSize: this.props.container.size,
            })
        }
        else if (option === ADD_NOTE) {
            this.setState({
                ...this.state,
                isEditNote: true,
            })
        }
    }

    handleContainerDoubleClick = () => {
        this.setState({
            ...this.state,
            isEdit: true,
            editName: this.props.container.name,
            editSize: this.props.container.size,
        })
    }

    createNewContainerNote = (text) => {
        var newContainerNote = {
            "_id": uuid("note"),
            "containerId": this.props.container._id,
            "text": text
        }
        return newContainerNote
    }

    handleEditNoteSubmit = () => {
        // this.props.editContainerNote({
        //     ...this.props.snapshot,
        //     containerNote: this.state.containerNote,
        //     containerId: this.props.container._id
        // })
        this.props.addContainerNote(this.createNewContainerNote(this.state.containerNote))
        this.setState({
            ...this.state,
        })
    }

    handleEditNoteChange = (e) => {
        this.setState({
            ...this.state,
            containerNote: e.target.value
        })
    }

    handleEditNoteEsc = () => {
        this.setState({
            ...this.state,
            containerNote: ""
        })
    }

    render () {
        const { classes } = this.props
        const options = [
            EDIT,
            ADD_NOTE,
            DELETE_FROM_ALL_SNAPSHOTS,
        ]
        const items = this.getItems(this.props.items, this.props.container._id)

        const notes = (this.state.isEditNote 
            ? (
                <EditContainerNote 
                    containerNote={this.state.containerNote}
                    handleNoteChange={this.handleEditNoteChange}
                    handleNoteEsc={this.handleEditNoteEsc}
                    handleNoteEnter={this.handleEditNoteSubmit}
                />
            ) 
            : null)

        const containerCard = (
            <Droppable droppableId={this.props.container._id} ignoreContainerClipping={true}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                        <Card className={classes.card}>
                            <CardHeader
                                className={classes.cardHeader}
                                title={
                                    <Typography variant="body1" align="left">
                                        <b>{this.props.container.name}</b>
                                    </Typography>
                                }
                                onDoubleClick={this.handleContainerDoubleClick}
                                action={<MoreMenu options = {options} handleItemClick = {this.handleItemClick} />}
                                avatar={<OccupancyDisplay total={this.props.container.size} count={items.length} />}
                            />
                            {notes}
                            <CardContent className={classes.cardContent}>
                                {
                                    items.map((item, index) => {
                                        if (typeof item !== 'undefined')
                                            return (
                                                <Grid item xs={12} key={item._id}>
                                                    <Item 
                                                        item={item} 
                                                        index={index} 
                                                        getDragItemColor={this.props.getDragItemColor} 
                                                        containerId={this.props.container._id} />
                                                </Grid>
                                            )
                                        return {}
                                    })
                                }
                                {provided.placeholder}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </Droppable>
        )

        const editContainer = (
            <EditContainer 
                name={this.state.editName}
                size={this.state.editSize}
                handleNameChange={this.handleEditContainerNameChange}
                handleSizeChange={this.handleEditContainerSizeChange}
                handleEnter={this.handleSaveEditContainer}
                handleEsc={this.handleEditContainerEscKey}
            />
        )


        if (this.state.isEdit) {
            return editContainer
        }
        return containerCard
    }
}

Container.propTypes = {
    snapshot: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        snapshot: PropTypes.object
    }),
    items: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    })),
    container: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    }),
    deleteContainer: PropTypes.func,
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
        editContainer: (container) => {
            dispatch(editContainer(container))
        },
        addContainerNote: (note) => {
            dispatch(addContainerNote(note))
        },
        editContainerNote: (snapshot) => {
            dispatch(editContainerNote(snapshot))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(Container))