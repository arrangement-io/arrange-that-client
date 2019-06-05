import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export class ContainerCellEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            containerId: (this.props.value) ? this.props.value._id : "",
            open: false
        }
        // this.props.value is the currently selected value
        // this.props.values are the possible values
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            containerId: event.target.value,
            open: false
        },
        // Stop editing and send Ag Grid the data
        () => this.props.api.stopEditing()
        );
    }

    afterGuiAttached() {
        this.setState({
            ...this.state,
            open: true
        })
    }

    // Returns the value to to be rendered by Ag Grid
    getValue = () => {
        return this.props.values.find(obj => obj._id === this.state.containerId);
    };

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