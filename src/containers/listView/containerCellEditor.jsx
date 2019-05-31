import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

export class ContainerCellEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            containerId: (this.props.value) ? this.props.value._id : "",
            open: false
        }
        console.log(this.props.value); // This is the currently selected value
        console.log(this.props.values); // This is the possible values
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            containerId: event.target.value,
            open: false
        },
        () => this.props.api.stopEditing()
        );
    }

    onKeyPress(event) {
        if (!isNumeric(event.nativeEvent)) {
            event.preventDefault();
        }

        function isNumeric(event) {
            return /\d/.test(event.key);
        }
    }

    onKeyDown(event) {
        // if (event.keyCode === 39 || event.keyCode === 37) {
        //     event.stopPropagation();
        // }
    }

    afterGuiAttached() {
        this.setState({
            ...this.state,
            open: true
        })
    }

    getValue = () => {
        return this.props.values.find(obj => obj._id === this.state.containerId);
    };

    componentDidMount() {
        // this.textInput.current.addEventListener('keydown', this.onKeyDown);
    }

    render() {
        const options = this.props.values.map(container => 
            <MenuItem key={container._id} value={container._id}>{container.name}</MenuItem>);
        options.unshift(<MenuItem key="-1" value="unassigned"><em>unassigned</em></MenuItem>)
        return (
            <Select
                open={this.state.open}
                value={this.state.containerId}
                onChange={this.handleChange}
                onClose={this.handleChange}
                input={<Input name="container" id="age-native-helper" />}
            >
                {options}
            </Select>
        );
    }
}