import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, TextField, Card, CardHeader } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const ENTER = 'Enter';
const KEYDOWN = 'keydown';
const MOUSEDOWN = 'mousedown';
const ESCAPE = 27;

const styles = () => ({
    sizeField: {
        width: 40,
    },
});

export class EditContainer extends Component {
    constructor(props) {
        super(props);

        this.handleNameKeyPress = this.handleNameKeyPress.bind(this);
        this.handleSizeKeyPress = this.handleSizeKeyPress.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.escFunction = this.escFunction.bind(this);
        this.containerRef = React.createRef();
    }

    handleNameKeyPress = (e) => {
        if (e.key === ENTER && this.props.name !== '') {
            if (this.props.size === '' || this.props.size === 0) {
                this.inputSize.focus();
            } else {
                this.props.handleEnter(e.key);
                this.inputSize.focus();
            }
        }
    }

    handleSizeKeyPress = (e) => {
        if (e.key === ENTER && this.props.size !== 0 && this.props.size !== '') {
            if (this.props.name === '') {
                this.inputName.focus();
            } else {
                this.props.handleEnter(e.key);
            }
        }
    }

    handleClick = (e) => {
        if (this.containerRef.contains(e.target)) { // Click inside, don't do anything
            return;
        }
        if (this.props.name !== '' && this.props.size !== 0 && this.props.size !== '') {
            this.props.handleEnter(null);
        } else if (this.props.name === '' && (this.props.size === '' || this.props.size === 0)) {
            this.props.handleEsc();
        }
    }

    handlePasteText = (e) => {
        const pastedText = e.clipboardData.getData('Text');
        this.props.handlePaste(pastedText);
    }

    escFunction = (event) => {
        if (event.keyCode === ESCAPE) {
            this.props.handleEsc();
        }
    }

    componentDidMount() {
        document.addEventListener(KEYDOWN, this.escFunction, false);
        document.addEventListener(MOUSEDOWN, this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener(KEYDOWN, this.escFunction, false);
        document.removeEventListener(MOUSEDOWN, this.handleClick, false);
    }

    render() {
        const { classes } = this.props;
        const focusSize = this.props.size === 0 || this.props.size === '' || this.props.size === undefined;
        return (
            <div ref={containerRef => this.containerRef = containerRef}>
                <Card ref={containerRef => this.containerRef = containerRef}>
                    <CardHeader
                        avatar={
                            <Typography variant="h5" align="center">
                                <TextField
                                    type="number"
                                    className={classes.sizeField}
                                    inputRef={field => this.inputSize = field}
                                    onKeyPress={this.handleSizeKeyPress}
                                    onChange={this.props.handleSizeChange}
                                    onPaste={this.handlePasteText}
                                    value={this.props.size > 0 ? this.props.size : ''}
                                    autoFocus={focusSize}
                                    placeholder="Size"
                                />
                            </Typography>
                        }

                        title={
                            <Typography variant="h5" align="center">
                                <TextField
                                    inputRef={field => this.inputName = field}
                                    onKeyPress={this.handleNameKeyPress}
                                    onChange={this.props.handleNameChange}
                                    value={this.props.name}
                                    placeholder="Name"
                                    autoFocus={!focusSize}
                                />
                            </Typography>
                        }
                    />
                </Card>
            </div>
        );
    }
}

EditContainer.propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
    handleNameChange: PropTypes.func,
    handleSizeChange: PropTypes.func,
    handleEnter: PropTypes.func,
    handleEsc: PropTypes.func,
};

export default withStyles(styles)(EditContainer);
