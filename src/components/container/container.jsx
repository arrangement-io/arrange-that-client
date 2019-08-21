import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, Card, CardHeader, CardContent } from '@material-ui/core'
import MoreMenu from 'components/moremenu/moremenu'
import { connect } from 'react-redux'
import { SortableHandle } from 'react-sortable-hoc';

import Item from 'components/item/item'
import EditContainer from 'components/editContainer/editContainer'
import OccupancyDisplay from 'components/container/occupancyDisplay'
import { editContainer, deleteContainer } from 'actions/container/container'
import { bulkSetUnassignedItems, bulkSetContainerItems, saveArrangementState } from 'actions/real/real'
import { editSnapshotContainerNote, deleteSnapshotContainerNote } from 'actions/snapshot/snapshot'
import EditContainerNote from 'components/container/editContainerNote'
import { SortableItemCollection } from 'components/item/sortableItem';

import { withStyles } from '@material-ui/core/styles'
import { Droppable } from 'react-beautiful-dnd'
import { uuid } from '../../utils';

const EDIT_NOTE = "Edit Note"
const DELETE_NOTE = "Delete Note"
const EDIT = "Edit";
const REMOVE_ALL = "Remove all";
const DELETE_FROM_ALL_SNAPSHOTS = "Delete from all snapshots";

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

// Create a drag handle out of the name of the container
const DragHandle = SortableHandle(({name}) => (
    <div style={{cursor: "grab"}}>
        <Typography variant="body1" align="left">
            <b>{name}</b>
        </Typography>
    </div>));

export class Container extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isEdit: false,
            editName: this.props.container.name,
            editSize: this.props.container.size,
            isEditNote: false, 
            containerNote: this.findContainerNote(),
            containerNoteText: this.findContainerNoteText()
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

    addAllItemToUnassigned = () => {
        const updatedItemsList = [...this.props.snapshot.unassigned];

        this.props.items.forEach(item => {
            if (!this.props.snapshot.unassigned.includes(item._id)) {
                updatedItemsList.push(item._id);
            }
            else {
                console.log("Item was found in unassigned when it shouldn't be!");
            }
        })
        this.props.bulkSetUnassignedItems(this.props.snapshot._id, updatedItemsList);  
    }
    
    removeAllItemFromContainer = () => {
        const snapshotContainer = this.props.snapshot.snapshotContainers.find(container => container._id === this.props.container._id);
        const updatedItemsList = snapshotContainer.items.filter(itemId => !this.props.items.find(itemToRemove => itemToRemove._id === itemId));
        this.props.bulkSetContainerItems(this.props.snapshot._id, this.props.container._id, updatedItemsList);
    }

    removeAllItems = () => {
        this.addAllItemToUnassigned();
        this.removeAllItemFromContainer();
        this.props.saveArrangementState();
    }

    handleMenuSelection = (option) => {
        if (option === DELETE_FROM_ALL_SNAPSHOTS) {
            this.props.deleteContainer(this.props.container._id)
        }
        if (option === REMOVE_ALL) {
            this.removeAllItems();
        }
        else if (option === EDIT) {
            this.setState({
                ...this.state,
                isEdit: true,
                editName: this.props.container.name,
                editSize: this.props.container.size,
            })
        }
        else if (option === EDIT_NOTE) {
            this.editNote();
        } else if (option === DELETE_NOTE) {
            this.deleteNote();   
        }
    }

    editNote = () => {
        this.setState({
            ...this.state,
            isEditNote: true,
        });
    }

    deleteNote = () => {
        var noteObject = this.findContainerNote()
        if (noteObject !== undefined) {
            this.props.deleteSnapshotContainerNote(this.props.snapshot._id, noteObject._id)
        }
        this.setState({
            ...this.state,
            containerNote: null,
            containerNoteText: "",
            isEditNote: false,
        })
    }

    saveNote = () => {
        if (this.state.containerNote) {
            this.props.editSnapshotContainerNote(this.props.snapshot._id, {...this.state.containerNote, text: this.state.containerNoteText})
        } else {
            this.props.editSnapshotContainerNote(this.props.snapshot._id, this.createNewContainerNote(this.state.containerNoteText))
        }
        this.setState({
            ...this.state,
            isEditNote: false,
            containerNote: this.findContainerNote()
        })
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
        return newContainerNote;
    }

    handleEditNoteSubmit = () => {
        if (this.state.containerNoteText) {
            this.saveNote();
        } else {
            this.deleteNote();
        }
    }

    handleEditNoteChange = (e) => {
        this.setState({
            ...this.state,
            containerNoteText: e.target.value
        })
    }

    handleEditNoteEsc = () => {
        this.setState({
            ...this.state,
            isEditNote: false,
            containerNoteText: this.findContainerNoteText()
        })
    }

    findContainerNote = () => {
        if (this.props.snapshot.containerNotes !== undefined) {
            return this.props.snapshot.containerNotes.find(x => (x && x.containerId === this.props.container._id))    
        } 
    }

    // Find the container note text if a note exists
    findContainerNoteText = () => {
        const noteObject = this.findContainerNote();
        if (noteObject !== undefined) {
            return noteObject.text;
        }
        return ""
    }

    // Render the container options. If Note doesn't exist don't give option to delete note.
    getContainerOptions = () => {
        return this.findContainerNoteText() !== "" ? 
            [
                EDIT,
                EDIT_NOTE,
                DELETE_NOTE,
                REMOVE_ALL,
                DELETE_FROM_ALL_SNAPSHOTS
            ] : 
            [
                EDIT,
                EDIT_NOTE,
                REMOVE_ALL,
                DELETE_FROM_ALL_SNAPSHOTS]
    }

    render () {
        const { classes } = this.props

        const options = this.getContainerOptions();

        // https://www.notion.so/atk/Add-notes-to-containers-83257eccdc7a4e1e9da4e0d322d4dc8e
        const noteText = this.findContainerNoteText();
        const noteObject = (noteText !== "" ? (
            <Typography variant="body1" align="left" gutterBottom onDoubleClick={this.editNote}>
                { noteText }
            </Typography>
        ) : null)

        const notes = (this.state.isEditNote 
            ? (
                <EditContainerNote 
                    containerNote={this.state.containerNoteText}
                    handleNoteChange={this.handleEditNoteChange}
                    handleNoteEsc={this.handleEditNoteEsc}
                    handleNoteEnter={this.handleEditNoteSubmit}
                />
            ) 
            : noteObject
        )

        const containerCard = (
            <Card className={classes.card}>
                <CardHeader
                    className={classes.cardHeader}
                    title={
                        <DragHandle name={this.props.container.name} />
                    }
                    onDoubleClick={this.handleContainerDoubleClick}
                    action={<MoreMenu options = {options} handleItemClick = {this.handleMenuSelection} />}
                    avatar={<OccupancyDisplay total={this.props.container.size} count={this.props.items.length} />}
                />
                <CardContent className={classes.cardContent}>{notes}</CardContent>
                <CardContent className={classes.cardContent}>
                    <SortableItemCollection
                        itemsInContainer={this.props.items}
                        displayEditItem={()=>{return}}
                    />
                </CardContent>
            </Card>      
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
    container: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    }),
    items: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    }))
}

const mapStateToProps = (state, ownProps) => {
    const { real } = state;
    return { real };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        editContainer: (container) => {
            dispatch(editContainer(container))
        },
        editSnapshotContainerNote: (snapshotId, note) => {
            dispatch(editSnapshotContainerNote(snapshotId, note))
        },
        deleteSnapshotContainerNote: (snapshotId, noteId) => {
            dispatch(deleteSnapshotContainerNote(snapshotId, noteId))
        },
        deleteContainer: (id) => {
            dispatch(deleteContainer(id))
        },
        bulkSetUnassignedItems: (snapshotId, unassigned) => {
            dispatch(bulkSetUnassignedItems(snapshotId, unassigned))
        },
        bulkSetContainerItems: (snapshotId, containerId, items) => {
            dispatch(bulkSetContainerItems(snapshotId, containerId, items))
        },
        saveArrangementState: () => {
            dispatch(saveArrangementState())
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(Container))