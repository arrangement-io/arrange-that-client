import React, { Component } from 'react'
import { Grid, Typography, Button } from '@material-ui/core';

import ItemCollection from 'components/itemcollection'
import ContainerCollection from 'components/containercollection'

import { get, post } from 'services/request'
import { ARRANGEMENT } from 'services/servicetypes';
import { EXPORT_ARRANGEMENT } from '../../services/servicetypes';

export class Arrange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      name: '',
      items: [],
      modified_timestamp: '',
      containers: [],
      is_deleted: false,
      timestamp: '',
      snapshots: [],
      unsnapshot_items: []
    }

    this.exportState = this.exportState.bind(this)
  }

  exportState () {
    var d = new Date()
    var seconds = d.getTime() / 1000
    let arrangement = {
      ...this.state,
      modified_timestamp: seconds
    }
    post({
      url: EXPORT_ARRANGEMENT,
      data: arrangement
    })
      .then(response => {
        console.log(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentDidMount () {
    // Call api and get the response, set state
    get({
      url: ARRANGEMENT
    })
      .then(response => {
        const snapshot = response.data.arrangement.snapshots[0]
        let items = response.data.arrangement.items
        for (var containerId in snapshot.snapshot) {
          for (var itemId in snapshot.snapshot[containerId]) {
            items = items.filter(ele => ele._id !== snapshot.snapshot[containerId][itemId])
          }
        }
        const stateVal = {
          ...response.data.arrangement,
          unsnapshot_items: items
        }
        this.setState(stateVal)
        return Promise.resolve();
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  render () {
    return (
      <Grid container spacing={24} className="arrange">
        <Grid item xs={12} sm={4}>
          <Typography variant="headline" gutterBottom align="left">
            {this.state.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="headline" gutterBottom align="center">
            <Button variant="outlined" color="primary" onClick={this.exportState}>
              Export
            </Button>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="headline" gutterBottom align="right">
            JS
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="headline" gutterBottom align="left">
            Items
          </Typography>
          <ItemCollection items={this.state.unsnapshot_items} />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <Typography variant="headline" gutterBottom align="left">
            Containers
          </Typography>
          <ContainerCollection snapshot={this.state.snapshots[0]} containers={this.state.containers} items={this.state.items} />
        </Grid>
      </Grid>
    )
  }
}

export default Arrange