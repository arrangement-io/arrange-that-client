import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'

const ENTER_KEY = 'Enter';
const ESC_KEY = 27;
const KEYDOWN = 'keydown';

export class EditContainerNote extends Component {
    constructor (props) {
        super(props)

        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.escFunction = this.escFunction.bind(this);
    }

    handleKeyPress = (event) => {
        switch (event.key) {
            case ENTER_KEY:
                this.props.handleNoteEnter(event.key);
                break;
            default:
                break;
        }
    }

    escFunction = (event) => {
        if(event.keyCode === ESC_KEY) {
            this.props.handleNoteEsc();
        }
    }

    componentDidMount(){
        document.addEventListener(KEYDOWN, this.escFunction, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }
  
    render () {
        return (
                <TextField
                multiline margin="none" placeholder="Add Note here"
                autoFocus={true}
                onKeyPress={this.handleKeyPress}
                onChange={this.props.handleNoteChange}
                onPaste={this.handlePasteText}
                value= {this.props.containerNote}
            />
        )
    }
}

EditContainerNote.propTypes = {
    containerNote: PropTypes.string,
    handleChange: PropTypes.func,
    handleEnter: PropTypes.func,
    handleEsc: PropTypes.func,
}

export default EditContainerNote;
