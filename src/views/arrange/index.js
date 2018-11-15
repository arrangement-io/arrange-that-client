import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Grid, Typography, Button } from '@material-ui/core'

import ItemCollection from 'containers/itemcollection'
import ContainerCollection from 'containers/containercollection'

import { get, post } from 'services/request'
import { ARRANGEMENT } from 'services/servicetypes'
import { EXPORT_ARRANGEMENT } from 'services/servicetypes'

import { setRealData, setUnassigned, setSnapshot } from 'actions/real'

import { DragDropContext } from 'react-beautiful-dnd'

import { reorder, move } from 'utils'

export class Arrange extends Component {
  constructor(props) {
    super(props)

    this.exportState = this.exportState.bind(this)
  }

  exportState () {
    var d = new Date()
    var seconds = d.getTime() / 1000
    let arrangement = {
      ...this.props.real,
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
        const stateVal = {
          ...response.data.arrangement
        }
        this.props.setRealData(stateVal)
        return Promise.resolve();
      })
      .catch(err => {
        return Promise.reject(err)
      })
    // For test without API call  
    /* this.setState(
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
    ) */
  }

  onDragEnd = result => {
    const { source, destination } = result
    if (!destination) { // dropped outside the list
      return
    }
    
    if (source.droppableId === destination.droppableId) { // dropped in same list
      let items = []
      if (source.droppableId === 'itemcollection') { // dropped in items' list, only reorder the items in list
        items = this.props.real.snapshots[0].unassigned
        items = reorder(
          items,
          source.index,
          destination.index
        )
        
        this.props.setUnassigned(items)
      } else { // dropped in a container, only reorder the items in a container
        items = this.props.real.snapshots[0].snapshot[source.droppableId]
        items = reorder(
          items,
          source.index,
          destination.index
        )

        this.props.setSnapshot({id: source.droppableId, items: items})
      }
    } else { // dropped in other list
      let result
      if (source.droppableId === 'itemcollection') { // dropped in a container from items' list, move item from items' list to a container
        let containerSize = typeof this.props.real.snapshots[0].snapshot[destination.droppableId] === 'undefined' ? 0 : this.props.real.snapshots[0].snapshot[destination.droppableId].length
        let container = this.props.real.containers.find(ele => ele._id === destination.droppableId)
        if (containerSize >= container.size) // ignore the dropdown if container's size is full
          return
        result = move(
          this.props.real.snapshots[0].unassigned,
          this.props.real.snapshots[0].snapshot[destination.droppableId],
          source,
          destination
        )

        this.props.setUnassigned(result['source'])
        this.props.setSnapshot({id: destination.droppableId, items: result['destination']})
      } else if (destination.droppableId === 'itemcollection') { // dropped in items' list from a container, move item from a container to items' list
        result = move(
          this.props.real.snapshots[0].snapshot[source.droppableId],
          this.props.real.snapshots[0].unassigned,
          source,
          destination
        )

        this.props.setSnapshot({id: source.droppableId, items: result['source']})
        this.props.setUnassigned(result['destination'])
      } else { // dropped in a container from another container, move item from a container to another container
        let containerSize = typeof this.props.real.snapshots[0].snapshot[destination.droppableId] === 'undefined' ? 0 : this.props.real.snapshots[0].snapshot[destination.droppableId].length
        let container = this.props.real.containers.find(ele => ele._id === destination.droppableId)
        if (containerSize >= container.size) // ignore the dropdown if container's size is full
          return
        result = move(
          this.props.real.snapshots[0].snapshot[source.droppableId],
          this.props.real.snapshots[0].snapshot[destination.droppableId],
          source,
          destination
        )

        this.props.setSnapshot({id: source.droppableId, items: result['source']})
        this.props.setSnapshot({id: destination.droppableId, items: result['destination']})
      }
    }
  }

  render () {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Grid container spacing={24} className="arrange">
          <Grid item xs={12} sm={4}>
            <Typography variant="headline" gutterBottom align="left">
              {this.props.real.name}
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
            <ItemCollection items={this.props.real.items} unsnapshot_items={typeof this.props.real.snapshots[0] === "undefined" ? [] : this.props.real.snapshots[0].unassigned} />   
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="headline" gutterBottom align="left">
              Containers
            </Typography>
            <ContainerCollection snapshot={this.props.real.snapshots[0]} containers={this.props.real.containers} items={this.props.real.items} />
          </Grid>
        </Grid>
      </DragDropContext>
    )
  }
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
    setRealData: (data) => {
      dispatch(setRealData(data))
    },
    setUnassigned: (data) => {
      dispatch(setUnassigned(data))
    },
    setSnapshot: (data) => {
      dispatch(setSnapshot(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (Arrange)