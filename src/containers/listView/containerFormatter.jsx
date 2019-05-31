import React, { Component } from 'react';

export class ContainerFormatter extends Component {
    render() {
        console.log(this.props.value)
        if (this.props.value) {
            const name = this.props.value.name;
            return (
                <span>{name}</span>
            )
        }
        return <span></span>;
    }
}

export default ContainerFormatter;