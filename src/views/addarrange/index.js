import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TextField, Button, Grid } from '@material-ui/core'

import { setRealData } from 'actions/real'
import { uuid } from 'utils'

export class AddArrange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arrangement_name: '',
      snapshot_name: ''
    }

    this.handleArrangementChange = this.handleArrangementChange.bind(this)
    this.handleSnapshotChange = this.handleSnapshotChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleArrangementChange (e) {
    this.setState({
      ...this.state,
      arrangement_name: e.target.value
    })
  }

  handleSnapshotChange (e) {
    this.setState({
      ...this.state,
      snapshot_name: e.target.value
    })
  }

  handleClick () {
    if (this.state.arrangement_name === '') {
      this.inputArrangement.focus()
      return
    }
    if (this.state.snapshot_name === '') {
      this.inputSnapshot.focus()
      return
    }
    var d = new Date()
    let real = {
      user: this.props.account.user.googleId,
      _id: uuid("arrangement"),
      containers: [],
      is_deleted: false,
      items: [],
      name: this.state.arrangement_name,
      users: [this.props.account.user.googleId],
      owner: this.props.account.user.googleId,
      snapshots: [{
        _id: uuid("snapshot"),
        name: this.state.snapshot_name,
        snapshot: {},
        unassigned: []
      }],
      timestamp: d.getTime() / 1000,
      modified_timestamp: d.getTime() / 1000
    }

    this.props.setRealData(real)
    this.props.history.push('/arrangement')
  }

  render () {
    return (
      <div className="addArrange">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              inputRef={field => this.inputArrangement = field}
              autoFocus={true}
              onChange={this.handleArrangementChange}
              val={this.state.arrangement_name}
              label="Arrangement Name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              inputRef={field => this.inputSnapshot = field}
              autoFocus={false}
              onChange={this.handleSnapshotChange}
              val={this.state.snapshot_name}
              label="Snapshot Name"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={this.handleClick}>
              OK
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    account
  } = state
  return {
    account
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setRealData: (data) => {
      dispatch(setRealData(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (AddArrange)