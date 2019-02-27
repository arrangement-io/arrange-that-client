import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"

import { get } from 'services/request'
import { ARRANGEMENT } from 'services/servicetypes'
import { setRealData } from 'actions/real/real'
import NavAppBar from 'components/navappbar/navappbar'

export class Header extends Component {
    constructor (props) {
        super(props)
        this.state = {
            open: false,
        }

        this.addArrangement = this.addArrangement.bind(this)
    }

    addArrangement (e) {
        this.handleClose(e)
        this.props.history.push('/addarrangement')
    }

  handleToggle = () => {
      this.setState(state => ({ open: !state.open }));
  }

  handleClose = event => {
      if (this.anchorEl.contains(event.target)) {
          return
      }

      this.setState({ open: false })
  }

  handleClick (event, id) {
      console.log(id)
      get({
          url: ARRANGEMENT + '/' + id + '/json'
      })
          .then(response => {
              const stateVal = {
                  ...response.data.arrangement
              }
              this.props.setRealData(stateVal)
              this.props.history.push('/arrangement')
              return Promise.resolve();
          })
          .catch(err => {
              return Promise.reject(err)
          })

      this.setState({ open: false })
  }

  render () {
      const { open } = this.state

      return <NavAppBar />
  }
}

const mapStateToProps = (state, ownProps) => {
    const {
        arrangements,
        account
    } = state
    return {
        arrangements,
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

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
) (Header))
