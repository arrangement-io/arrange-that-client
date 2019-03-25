import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, TextField, Grid, Card, CardHeader } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    sizeField: {
        width: 40
    }
})

export class EditContainer extends Component {
    constructor (props) {
        super(props)

        this.handleNameKeyPress = this.handleNameKeyPress.bind(this)
        this.handleSizeKeyPress = this.handleSizeKeyPress.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.escFunction = this.escFunction.bind(this);
        this.containerRef = React.createRef()
    }

    handleNameKeyPress = (e) => {
        if (e.key === 'Enter' && this.props.name !== '') {
            if (this.props.size === '' || this.props.size === 0) {
                this.inputSize.focus()
            } else {
                this.props.handleEnter()
                this.inputSize.focus()
                this.props.handleAddContainer()
            }
        }
    }

    handleSizeKeyPress = (e) => {
        if (e.key === 'Enter' && this.props.size !== 0 && this.props.size !== '') {
            if (this.props.name === '') {
                this.inputName.focus()
            } else {
                this.props.handleEnter()
                this.props.handleAddContainer()
            }
        }
    }

    handleClick = (e) => {
        if (this.containerRef.contains(e.target)) { //Click inside, don't do anything
            return;
        }
        if (this.props.name !== '' && this.props.size !== 0 && this.props.size !== '') {
            this.props.handleEnter()
        } else if (this.props.name === '' && (this.props.size === '' || this.props.size === 0)) {
            this.props.handleEsc()
        }
    }
    
    handlePasteText = (e) => {
        var pastedText = e.clipboardData.getData('Text')
        this.props.handlePaste(pastedText)
    }

    escFunction = (event) => {
        if(event.keyCode === 27) {
            this.props.handleEsc()
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
        document.removeEventListener("mousedown", this.handleClick, false);
    }
  
    render () {
        const { classes } = this.props
        return (
            <div ref={containerRef => this.containerRef = containerRef}>
                <Card ref={containerRef => this.containerRef = containerRef}>
                    <CardHeader
                        avatar={
                            <Typography variant="headline" align="center">
                                <TextField
                                    type="number"
                                    className={classes.sizeField}
                                    inputRef={field => this.inputSize = field}
                                    onKeyPress={this.handleSizeKeyPress}
                                    onChange={this.props.handleSizeChange}
                                    onPaste={this.handlePasteText}
                                    val={this.props.size}
                                    autoFocus={true}
                                    placeholder="Size"
                                    defaultValue={this.props.size > 0 ? this.props.size : ""}
                                    value={this.props.size > 0 ? this.props.size : ""}
                                />
                            </Typography>
                        }
                        
                        title={
                            <Typography variant="headline" align="center">
                                <TextField
                                    inputRef={field => this.inputName = field}
                                    onKeyPress={this.handleNameKeyPress}
                                    onChange={this.props.handleNameChange}
                                    val={this.props.name}
                                    placeholder="Name"
                                    defaultValue={this.props.name}
                                    value={this.props.name}
                                />
                            </Typography>
                        }
                    />
                </Card>
            </div>
        )
    }
}

EditContainer.propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
    handleNameChange: PropTypes.func,
    handleSizeChange: PropTypes.func,
    handleEnter: PropTypes.func,
    handleEsc: PropTypes.func
}

export default withStyles(styles)(EditContainer)