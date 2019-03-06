import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, TextField } from '@material-ui/core'

const ENTER_KEY = 'Enter';
const ESC_KEY = 'Escape';
// const TAB_KEY = 'Tab';
export class EditItem extends Component {
    constructor (props) {
        super(props)

        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.escFunction = this.escFunction.bind(this);
    }

    handleKeyPress (event) {
        switch (event.key) {
            case ENTER_KEY:
                this.props.handleEnter(event.key)
                break;
            //TODO add handler for tab key
            // case 'Tab':
            //     this.props.handleEnter(event.key)
            //     break;
            default:
                break;
        }
    }

    escFunction (event) {
        if(event.keyCode === ESC_KEY) {
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
                        onBlur={this.props.handleEnter}
                        val={this.props.name}
                        label="Name"
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
    handleEsc: PropTypes.func,
}

export default EditItem
