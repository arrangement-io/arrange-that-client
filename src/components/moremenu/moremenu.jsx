import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const ITEM_HEIGHT = 30

class MoreMenu extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            anchorEl: null,
        }

        this.handleClose = this.handleClose.bind(this)
    }
  

  handleClick = event => {
      this.setState({ anchorEl: event.currentTarget })
  }

  handleClose (event, option) {
      this.setState({ anchorEl: null })
      this.props.handleItemClick(option)
  }

  render() {
      const { anchorEl } = this.state
      const open = Boolean(anchorEl)

      return (
          <div>
              <IconButton
                  aria-label = "More"
                  aria-owns = {open ? 'long-menu' : null}
                  aria-haspopup = "true"
                  onClick = {this.handleClick}
              >
                  <MoreVertIcon />
              </IconButton>
              <Menu
                  id = "long-menu"
                  anchorEl = {anchorEl}
                  open = {open}
                  onClose = {this.handleClose}
                  PaperProps = {{
                      style: {
                          maxHeight: ITEM_HEIGHT * 4.5,
                          width: 200,
                      },
                  }}
              >
                  {this.props.options.map(option => (
                      <MenuItem key = {option} onClick = {(event) => this.handleClose(event, option)} >
                          {option}
                      </MenuItem>
                  ))}
              </Menu>
          </div>
      );
  }
}

export default MoreMenu