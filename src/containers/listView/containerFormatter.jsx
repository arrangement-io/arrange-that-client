import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import OccupancyDisplay from 'components/container/occupancyDisplay';

export class ContainerFormatter extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    numberOfItemsInContainer = (container) => {
        let count = 0;
        for (const row of this.props.agGridReact.gridOptions.rowData) {
            if (row.container && (row.container._id === container._id)) {
                count += 1;
            }
        }
        return count;
    }

    render() {    
        if (this.props.value) {
            const container = this.props.value;
            return (
                <div>
                    <Chip 
                        label={<b>{container.name}</b>} 
                        avatar={<OccupancyDisplay 
                            style={{marginLeft:"0px"}}
                            total={this.props.value.size} 
                            count={this.numberOfItemsInContainer(container)} />}
                        variant="outlined"/>
                </div>
            )
        }
        return <span></span>;
    }
}

export default ContainerFormatter;