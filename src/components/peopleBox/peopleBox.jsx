import React, { Component } from 'react';
import './styles.css';

class PeopleBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
        };
    }
    // componentDidMount() {
    //     this.setState({
    //         data: this.props.people
    //     })
    // }

    renderPeople() {
        const { people } = this.props;
        return people.map((car, index) => {
            const itemsList = Object.entries(car.items);
            return itemsList.map((item, index) => (
                <tr className = "people-box-table-item">
                    <td>
                        {item[1].name}
                    </td>
                    <td>
                            CAR
                    </td>
                    <td>
                        {item[1].status}
                    </td>
                </tr>
            ));
        });
    }
    render() {
        return (
            <div className = "people-box">
                <div className = "people-box-header">
                    <div className = "people-box-title">
                        <h2 >People</h2>
                    </div>
                </div>
                <div className = "people-box-body">
                    <table className = "people-box-table">
                        <thead className = "people-box-table-head">
                            <tr>
                                <td >
                                    Name
                                </td>
                                <td>
                                    Driver
                                </td>
                                <td>
                                    Status
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderPeople()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default PeopleBox;
