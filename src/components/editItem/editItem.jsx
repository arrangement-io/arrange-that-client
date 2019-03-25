import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, Typography, TextField } from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

const ENTER_KEY = 'Enter';
const ESC_KEY = 27;
const TAB_KEY = 9;

const styles = theme => ({
    card: {
        maxHeight: 40
    },
    cardHeader: {
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10
    }
})

export class EditItem extends Component {
    constructor (props) {
        super(props)

        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.escFunction = this.escFunction.bind(this);
    }

    handleKeyPress = (event) => {
        switch (event.key) {
            case ENTER_KEY:
                this.props.handleEnter(event.key)
                this.props.handleAddItem()
                break;
            //TODO add handler for tab key
            // case 'Tab':
            //     this.props.handleEnter(event.key)
            //     break;
            default:
                break;
        }
    }

    handlePasteText = (e) => {
        var pastedText = e.clipboardData.getData('Text')
        this.props.handlePaste(pastedText)
    }

    escFunction = (event) => {
        if(event.keyCode === ESC_KEY) {
            this.props.handleEsc()
        }
    }

    componentDidMount(){
        // TODO Add event listener for tab key in order to do the tab thing
        document.addEventListener("keydown", this.escFunction, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }
  
    render () {
        const { classes } = this.props;

        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader 
                        className={classes.cardHeader}
                        title={
                            <Typography variant="headline" align="center">
                                <TextField
                                    autoFocus={true}
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.props.handleChange}
                                    onBlur={() => this.props.handleEnter(null)}
                                    onPaste={this.handlePasteText}
                                    defaultValue={this.props.name}
                                    value={this.props.name}
                                    placeholder="Name"
                                />
                            </Typography>
                        }
                    />
                </Card>
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

export default withStyles(styles)(EditItem)
