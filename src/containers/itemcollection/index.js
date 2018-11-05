import React, { Component } from 'react'

import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'

import Item from 'components/item'
import EditItem from 'components/edititem'

import { addItem, deleteItem } from 'actions/item'

import { uuid } from 'utils'

export class ItemCollection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEdit: false,
      name: '',
      _id: '',
      size: 1
    }

    this.addEditItem = this.addEditItem.bind(this)
    this.displayEditItem = this.displayEditItem.bind(this)
    this.handleEditItemChange = this.handleEditItemChange.bind(this)
    this.handleEditItemEnterKey = this.handleEditItemEnterKey.bind(this)
    this.handleEditItemEscKey = this.handleEditItemEscKey.bind(this)
  }

  addEditItem () {
    this.setState({
      isEdit: true,
      _id: uuid('item'),
      name: '',
      size: 1
    })
  }

  handleEditItemChange (e) {
    this.setState({
      ...this.state,
      name: e.target.value
    })
  }

  handleEditItemEnterKey () {
    const item = {
      _id: this.state._id,
      name: this.state.name,
      size: this.state.size
    }

    this.setState({
      isEdit: false,
      name: '',
      _id: '',
      size: 1
    })

    this.props.addItem(item)
  }

  handleEditItemEscKey () {
    this.setState({
      isEdit: false,
      name: '',
      _id: '',
      size: 1
    })
  }

  displayEditItem () {
    if (this.state.isEdit) {
      return (
        <Grid item xs={12}>
          <EditItem 
            name={this.state.name}
            handleChange={this.handleEditItemChange}
            handleEnter={this.handleEditItemEnterKey}
            handleEsc={this.handleEditItemEscKey}
          />
        </Grid>
      )
    }
  }

  render () {
    return (
      <div className="itemcollection">
        <Grid container spacing={24}>
          {
            this.props.unsnapshot_items.map((id) => {
              return (
                <Grid item xs = {12} key = {id}>
                  <Item item = {this.props.items.find(ele => ele._id === id)} deleteItem = {this.props.deleteItem} />
                </Grid>
              )
            })
          }
          { this.displayEditItem() }
          <Grid item xs={12}>
            <div className="item" onClick={this.addEditItem}>
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

ItemCollection.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  })),
  unsnapshot_items: PropTypes.array
}

const mapStateToProps = (state, ownProps) => {
  return {}
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