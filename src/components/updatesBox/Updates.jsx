import React, { Component } from 'react';
import './styles.css';

class Updates extends Component {
    constructor(props) {
        super(props);
        this.stae = {
            data: '',
        };
    }
    renderUpdates() {
        const updates = Object.entries(this.props.updates);
        return updates.map((item, index) => (
            <div className = "updates-items">
                {item[1]}
            </div>
        ));
    }

    render() {
        return (
            <div className = "roster-updates-box">
                <div>
                    {this.renderUpdates()}
                </div>

            </div>
        );
    }
}

export default Updates;
