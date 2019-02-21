import React, { Component } from 'react'
import { Button, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core'
import { connect } from 'react-redux'
import { withRouter } from "react-router"

import { get } from 'services/request'
import { ARRANGEMENT } from 'services/servicetypes'
import { setRealData } from 'actions/real/real'

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

    return (
      <div>
        {
          this.props.account.isAuthenticated ? (
            <div>
              <Button
                variant="contained"
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                aria-owns={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={this.handleToggle}
              >
                MENU
              </Button>
              <Popper open={open} anchorEl={this.anchorEl} transition>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    id="menu-list-grow"
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList>
                          <MenuItem onClick={this.addArrangement}>+ Arrangement</MenuItem>
                          {
                            this.props.arrangements.map((ele, index) => {
                              return (
                                <MenuItem key = {index} onClick = {(event) => this.handleClick(event, ele.id)}>{ele.name}</MenuItem>
                              )
                            })
                          }
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          ) : (
            `Nav Bar`
          )
        }
      </div>
    )
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
