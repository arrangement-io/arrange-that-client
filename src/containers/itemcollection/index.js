import React, { Component } from 'react'

import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'

import Item from 'components/item'
import EditItem from 'components/edititem'

import { addItem } from 'actions/item'

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
      _id: this.uuid(),
      name: '',
      size: 1
    })
  }

  uuid() {
    var text = "i";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
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
            this.props.items.map((item) => {
              return (
                <Grid item xs={12} key={item._id}>
                  <Item item={item} />
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
  }))
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addItem: (item) => {
      dispatch(addItem(item))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (ItemCollection)