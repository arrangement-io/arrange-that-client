import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'

import { connect } from 'react-redux'

import Container from 'components/container'

import EditContainer from 'components/editcontainer'

import { addContainer } from 'actions/container'

import { deleteItem } from 'actions/item'
import { deleteContainer } from 'actions/container'

import { uuid, getListStyle } from 'utils'
import { Droppable } from 'react-beautiful-dnd'

export class ContainerCollection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEdit: false,
      name: '',
      _id: '',
      size: 0
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
      size: 0
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

    this.setState({
      isEdit: false,
      name: '',
      _id: '',
      size: 0
    })

    this.props.addContainer(container)
  }

  handleEditContainerEscKey () {
    this.setState({
      isEdit: false,
      name: '',
      _id: '',
      size: 0
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
            handleEsc={this.handleEditContainerEscKey}
          />
        </Grid>
      )
    }
  }

  render () {
    return (
      <div className="containercollection">
        <Grid container spacing={24}>
          {
            this.props.containers.map((container) => {
              return (
                <Grid item xs={12} sm={4} md={3} key={container._id}>
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
          <Grid item xs={12} sm={4} md={3}>
            <div className="container" onClick={this.addEditContainer}>
              <Typography variant="headline" align="center">
                +
              </Typography>
            </div>
          </Grid>
        </Grid>
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
  return {}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (ContainerCollection)