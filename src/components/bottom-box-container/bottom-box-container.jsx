import React, { Component } from 'react';
import PeopleBox from './../peopleBox/peopleBox';
import Updates from './../updatesBox/Updates';
import './styles.css';


class BottomBoxContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    containers: {
                        cW42GKAST: { _id: 'cW42GKAST', name: 'car', size: 3 },
                    },
                    is_deleted: false,
                    items: {
                        chibuzor: {
                            id: 'chibuzor', name: 'chibuzor', size: 1, status: 1,
                        },
                        michael: {
                            id: 'michael', name: 'michael', size: 1, status: 0,
                        },
                        john: {
                            id: 'john', name: 'john', size: 1, status: 1,
                        },
                    },
                },
                {
                    containers: {
                        something: { _id: 'something', name: 'car', size: 2 },
                    },
                    is_deleted: false,
                    items: {
                        person1: { id: 'person1', name: 'person1', size: 1 },
                        person2: { id: 'person2', name: 'person2', size: 1 },
                        chibuzor: {
                            id: 'chibuzor', name: 'chibuzor', size: 1, status: 1,
                        },
                        michael: {
                            id: 'michael', name: 'michael', size: 1, status: 0,
                        },
                        john: {
                            id: 'john', name: 'john', size: 1, status: 1,
                        },
                    },
                },
                {
                    containers: {
                        something: { _id: 'something', name: 'car', size: 2 },
                    },
                    is_deleted: false,
                    items: {
                        person1: { id: 'person1', name: 'person1', size: 1 },
                        person2: { id: 'person2', name: 'person2', size: 1 },
                        chibuzor: {
                            id: 'chibuzor', name: 'chibuzor', size: 1, status: 1,
                        },
                        michael: {
                            id: 'michael', name: 'michael', size: 1, status: 0,
                        },
                        john: {
                            id: 'john', name: 'john', size: 1, status: 1,
                        },
                    },
                },
            ],
            updates: {
                here: 7,
                tocome: 2,
                unassigned: 2,
            },

        };
    }

    render() {
        return (
            <div className = "bottom_box">
                <PeopleBox className="people-box" people = {this.state.data}/>
                <Updates className = "update-box" updates = {this.state.updates} />
            </div>
        );
    }
}

export default BottomBoxContainer;
