import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import { Grid, Typography, Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import Container from 'components/container/container'
import EditContainer from 'components/editContainer/editContainer'
import { addContainer, deleteContainer } from 'actions/container/container'
import { snapshotSetContainers } from 'actions/snapshot/snapshot'
import { uuid, validateName, checkDuplicate, reorder } from 'utils'


const styles = theme => ({
    card: {
        background:"#fafafa"
    },
    cardHeader: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 0,
        paddingRight: 10
    },
    cardContent: {
        maxHeight: "calc(100vh - 341px)",
        overflow: "scroll"
    }
})

// Using react-sortable-hoc to create a sortable container element
const SortableContainerElement = SortableElement(({container, snapshot, items, deleteContainer, style}) => {
    return (
        <div style={style}>
            <Container 
                container={container}
                snapshot={snapshot} 
                items={items} 
                deleteContainer={deleteContainer}
            />
        </div>
    )
});

// Using react-sortable-hoc to create a container for the sortable containers
const SortableContainerCollection = SortableContainer(({snapshot, containers, items, deleteContainer, displayEditContainer}) => {
    return (
        <Grid container spacing={8}>
            {
                snapshot.snapshotContainers.map((snapshotContainer, index) => {
                    let container = containers.find(c => c._id === snapshotContainer._id);
                    if (container) {
                        return (
                            <Grid item xs={12} sm={6} md={3} lg={2} key={snapshotContainer._id}>
                                <SortableContainerElement 
                                    key={`item-${index}`} 
                                    index={index} 
                                    container={container}
                                    snapshot={snapshot}
                                    items={items}
                                    deleteContainer={deleteContainer}
                                    style={{zIndex: 1000}}
                                />
                            </Grid>
                        )  
                    }
                })
            }
            { displayEditContainer() }
        </Grid>        
    )
});

export class ContainerCollection extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isEdit: false,
            name: '',
            _id: '',
            size: 0,
            isAlert: false
        }

        this.addEditContainer = this.addEditContainer.bind(this)
        this.displayEditContainer = this.displayEditContainer.bind(this)
        this.handleEditContainerNameChange = this.handleEditContainerNameChange.bind(this)
        this.handleEditContainerEnterKey = this.handleEditContainerEnterKey.bind(this)
        this.handleEditContainerEscKey = this.handleEditContainerEscKey.bind(this)
        this.handleEditContainerSizeChange = this.handleEditContainerSizeChange.bind(this)
    }

    addEditContainer () {
        this.setState({
            isEdit: true,
            _id: uuid('container'),
            name: '',
            size: 0,
        })
    }

    handleEditContainerNameChange (e) {
        this.setState({
            ...this.state,
            name: e.target.value
        })
    }

    handleEditContainerSizeChange (e) {
        let val = parseInt(e.target.value)
        if (isNaN(val)) {
            val = 0
        }
        this.setState({
            ...this.state,
            size: val
        })
    }

    handleEditContainerEnterKey (event) {
        const container = {
            _id: this.state._id,
            name: this.state.name,
            size: this.state.size
        }

        if (checkDuplicate(container, this.props.real.containers)) {
            //Duplicates not found
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 0,
            })

            this.props.addContainer(container)
            // If user presses enter, add another container
            if (event === 'Enter') {
                this.setState({
                    isEdit: true,
                    _id: uuid('container'),
                })
            }
            return
        } else { // duplicates found
            if (this.state.size === '') { // user inputed size
                this.setState({
                    isEdit: false,
                    name: '',
                    _id: '',
                    size: 1,
                })
                this.props.enqueueSnackbar('Duplicated name: ' + container.name)
            } else {
                this.setState({
                    ...this.state,
                })
                this.props.enqueueSnackbar('Duplicated name: ' + container.name)
            }
        }
    }

    // This function splits a string by tabs/newlines and individually
    // submits each container and then adds another edit container. It
    // assumes the default size of the container is 5 (a typical sedan)
    handleEditContainerPaste = (pasteString) => {
        //TODO does this work on Windows? Does it need to check for carriage return?
        var splitStrings = pasteString.split(/[\t\n]/)

        for (let containerName of splitStrings) {
            const container = {
                _id: uuid('container'),
                name: containerName,
                size: 5
            }
    
            // Prevent the addition of an empty item, null item, or all whitespace item
            if (!validateName(container.name)) {
                continue;
            }

            if (checkDuplicate(container, this.props.real.containers)) {
                //Duplicates not found
                this.setState({
                    isEdit: false,
                    name: '',
                    _id: '',
                    size: 0,
                })

                this.props.addContainer(container)
            } else {
                //Duplicates found
                this.props.enqueueSnackbar('Duplicated name: ' + container.name)
            }
        }
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 0,
        })
    }

    handleEditContainerEscKey () {
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 0,
        })
    }

    displayEditContainer () {
        if (this.state.isEdit) {
            return (
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <EditContainer 
                        name={this.state.name}
                        size={this.state.size}
                        handleNameChange={this.handleEditContainerNameChange}
                        handleSizeChange={this.handleEditContainerSizeChange}
                        handleEnter={this.handleEditContainerEnterKey}
                        handlePaste={this.handleEditContainerPaste}
                        handleEsc={this.handleEditContainerEscKey}
                    />
                </Grid>
            )
        }
    }

    handleClose = (event, reason) => {
        this.setState({
            ...this.state,
        });
    };

    totalAvailableSpaces = (props) => {
        return props.containers.reduce((total, container) => total + container.size, 0)
    }

    numberUsedSpaces = (props) => {
        return props.items.length - props.snapshot.unassigned.length
    }

    onSortEnd = ({oldIndex, newIndex}) => { 
        console.log(oldIndex)
        console.log(newIndex);
        let containers = this.props.snapshot.snapshotContainers
        containers = reorder(containers, oldIndex, newIndex);
        this.props.snapshotSetContainers(this.props.snapshot._id, containers);
    }

    render () {
        const { classes } = this.props;
        const totalAvailableSpaces = this.totalAvailableSpaces(this.props);
        const numberUsedSpaces = this.numberUsedSpaces(this.props)
        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader className={classes.cardHeader} title="Spaces"/>
                    <CardContent>
                        <Grid container spacing={8}>
                            <Grid item xs>Free space: {totalAvailableSpaces - numberUsedSpaces}/{totalAvailableSpaces}</Grid>
                            <Grid item xs>Total number of containers: {this.props.containers.length}</Grid>
                        </Grid>
                    </CardContent>
                    <CardContent className={classes.cardContent}>
                        <SortableContainerCollection
                            snapshot={this.props.snapshot}
                            containers={this.props.containers}
                            items={this.props.items}
                            deleteContainer={this.deleteContainer}
                            displayEditContainer={this.displayEditContainer}
                            classes={classes} 
                            onSortEnd={this.onSortEnd}
                            useDragHandle={true}
                            axis="xy"
                            lockOffset="0%" />
                    </CardContent>
                    <CardActions>
                        <Button variant="text" color="default" onClick={this.addEditContainer}>
                            <Typography variant="body1" align="left">
                                + add a space
                            </Typography>
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

ContainerCollection.propTypes = {
    snapshot: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        snapshot: PropTypes.object
    }),
    containers: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    })),
    items: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number
    }))
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
        addContainer: (container) => {
            dispatch(addContainer(container))
        },
        deleteContainer: (id) => {
            dispatch(deleteContainer(id))
        },
        snapshotSetContainers: (snapshotId, snapshotContainers) => {
            dispatch(snapshotSetContainers(snapshotId, snapshotContainers));
        }
    }
}

export default withSnackbar(withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(ContainerCollection))))
