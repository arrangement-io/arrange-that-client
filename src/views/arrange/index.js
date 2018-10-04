import React, { Component } from 'react'
import { Grid, Typography } from '@material-ui/core';

import ItemCollection from 'components/itemcollection'
import ContainerCollection from 'components/containercollection'

import { get } from 'services/request'
import { ARRANGEMENT } from 'services/servicetypes';

export class Arrange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      name: '',
      items: [],
      containers: [],
      is_deleted: false,
      timestamp: '',
      snapshots: []
    }
  }

  componentDidMount () {
    // Call api and get the response, set state
    get({
      url: ARRANGEMENT
    })
      .then(response => {
        this.setState(response.data)
        return Promise.resolve();
      })
      .catch(err => {
        return Promise.reject(err)
      })
    this.setState(
      {
        "_id": "aJDUX35L6",
        "containers": [
          {
          "_id": "cBRXCRDX0",
          "name": "chia van",
          "size": 8
          },
          {
          "_id": "cF7X2WFXW",
          "name": "nathan car",
          "size": 8
          }
        ],
        "is_deleted": false,
        "items": [
          {
          "_id": "i9LJ1YT7H",
          "name": "gideon",
          "size": 1
          },
          {
          "_id": "iBCMM3B14",
          "name": "gideon luggage",
          "size": 1
          },
          {
          "_id": "iRREMT1HT",
          "name": "jeff",
          "size": 1
          },
          {
          "_id": "iO0SQPBSV",
          "name": "nathan",
          "size": 1
          },
          {
          "_id": "iPOWL7Z7F",
          "name": "moses",
          "size": 1
          }
        ],
        "name": "first arrangement",
        "snapshots": [
          {
            "_id": "sNC096STL",
            "name": "only snapshot",
            "snapshot": {
              "cBRXCRDX0": [
                "iO0SQPBSV",
                "iBCMM3B14",
                "iPOWL7Z7F"
              ]
            }
          }
        ],
        "timestamp": 1538582360.173882
      }
       )
  }

  render () {
    return (
      <Grid container spacing={24} className="arrange">
        <Grid item xs={12} sm={6}>
          <Typography variant="headline" gutterBottom align="left">
            {this.state.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="headline" gutterBottom align="right">
            JS
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <ItemCollection items={this.state.items} />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <ContainerCollection snapshots={this.state.snapshots} containers={this.state.containers} items={this.state.items} />
        </Grid>
      </Grid>
    )
  }
}

export default Arrange
