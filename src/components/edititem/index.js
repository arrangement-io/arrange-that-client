import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, TextField } from '@material-ui/core'

export class EditItem extends Component {
  constructor (props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.escFunction = this.escFunction.bind(this);
  }

  handleKeyPress (event) {
    if (event.key === 'Enter') {
      this.props.handleEnter()
    }
  }

  escFunction (event) {
    if(event.keyCode === 27) {
      this.props.handleEsc()
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction, false);
  }
  
  render () {
    return (
      <div className="item">
        <Typography variant="headline" align="center">
          <TextField
            autoFocus={true}
            onKeyPress={this.handleKeyPress}
            onChange={this.props.handleChange}
            onBlur={this.props.handleEsc}
            val={this.props.name}
          />
        </Typography>
      </div>
    )
  }
}

EditItem.propTypes = {
  name: PropTypes.string,
  handleChange: PropTypes.func,
  handleEnter: PropTypes.func,
  handleEsc: PropTypes.func
}

export default EditItem