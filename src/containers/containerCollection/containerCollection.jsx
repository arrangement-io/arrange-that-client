import React, { Component } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Grid, Typography, Snackbar, Card, CardHeader, CardContent } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import { connect } from 'react-redux'

import Container from 'components/container/container'

import EditContainer from 'components/editContainer/editContainer'

import { addContainer, deleteContainer } from 'actions/container/container'

import { deleteItem } from 'actions/item/item'
import { withStyles } from '@material-ui/core/styles'

import { uuid, validateName } from 'utils'
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

function checkDuplicateIDOrName (item, allItems) {
    var nameDuplicated = allItems.find((ele) => (ele.name === item.name))
    var idDuplicated = allItems.find((ele) => (ele._id === item._id))
    return (typeof nameDuplicated === 'undefined' && typeof idDuplicated === 'undefined')
};

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
            isAlert: false
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

    handleEditContainerEnterKey () {
        const container = {
            _id: this.state._id,
            name: this.state.name,
            size: this.state.size
        }

        if (checkDuplicateIDOrName(container, this.props.real.containers)) {
            //Duplicates not found
            this.setState({
                isEdit: false,
                name: '',
                _id: '',
                size: 0,
                isAlert: false
            })

            this.props.addContainer(container)
            return
        } else { // duplicates found
            if (this.state.size === '') { // user inputed size
                this.setState({
                    isEdit: false,
                    name: '',
                    _id: '',
                    size: 1,
                    isAlert: false
                })
                this.props.enqueueSnackbar('Duplicated name: ' + container.name)
            } else {
                this.setState({
                    ...this.state,
                    isAlert: false
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
            //TODO Need to double check whether this logic of interacting with other functions is correct
            const container = {
                _id: uuid('container'),
                name: containerName,
                size: 5
            }
    
            // Prevent the addition of an empty item, null item, or all whitespace item
            if (!validateName(container.name)) {
                continue;
            }

            if (checkDuplicateIDOrName(container, this.props.real.containers)) {
                //Duplicates not found
                this.setState({
                    isEdit: false,
                    name: '',
                    _id: '',
                    size: 0,
                    isAlert: false
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
            isAlert: false
        })
    }

    handleEditContainerEscKey () {
        this.setState({
            isEdit: false,
            name: '',
            _id: '',
            size: 0,
            isAlert: false
        })
    }

    displayEditContainer () {
        if (this.state.isEdit) {
            return (
                <Grid item xs={12} sm={4} md={3}>
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
            isAlert: false
        });
    };

    render () {
        const { classes } = this.props;

        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader className={classes.cardHeader} title="Spaces"/>
                    <CardContent className={classes.CardContent}>
                        <Grid container spacing={8}>
                            {
                                this.props.containers.map((container) => {
                                    return (
                                        <Grid item xs={12} sm={6} md={3} lg={2} key={container._id}>
                                            <Container 
                                                container={container}
                                                snapshot={this.props.snapshot} 
                                                items={this.props.items} 
                                                deleteItem={this.props.deleteItem} 
                                                deleteContainer={this.props.deleteContainer}
                                                getDragItemColor={this.props.getDragItemColor}
                                            />
                                        </Grid>
                                    )
                            
                                })
                            }
                            { this.displayEditContainer() }
                            <Grid item xs={12} sm={6} md={3} lg={2}>
                                <div className="container" onClick={this.addEditContainer}>
                                    <Typography variant="headline" align="center">
                                    +
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>        
                    </CardContent>
                </Card>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.isAlert}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'container-duplicated',
                    }}
                    message={<span id="container-duplicated">Container duplicated</span>}
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
    })),
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
        addContainer: (container) => {
            dispatch(addContainer(container))
        },
        deleteItem: (id) => {
            dispatch(deleteItem(id))
        },
        deleteContainer: (id) => {
            dispatch(deleteContainer(id))
        } 
    }
}

export default withSnackbar(withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
) (withStyles(styles)(ContainerCollection))))