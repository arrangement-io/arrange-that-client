import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'

import { connect } from 'react-redux'

import Container from 'components/container'

import EditContainer from 'components/editcontainer'

import { addContainer } from 'actions/container'

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
      _id: this.uuid(),
      name: '',
      size: 0
    })
  }

  uuid() {
    var text = "c";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
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
                  <Container container={container} snapshot={this.props.snapshot} items={this.props.items} />
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
  }))
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addContainer: (container) => {
      dispatch(addContainer(container))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (ContainerCollection)