import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cloneDeep from 'lodash/cloneDeep';

import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { withSnackbar } from 'notistack';
import Timestamp from 'react-timestamp';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import { updateArrangement, getAllArrangements } from 'services/arrangementService';
import { setArrangements } from 'actions/arrangements/arrangements';
import { uuid } from 'utils';

class AllArrangementsTable extends Component {
    loadArrangements = () => getAllArrangements(this.props.account.user.googleId)
        .then((response) => {
            this.props.setArrangements(response.data);
            Promise.resolve();
        })
        .catch((err) => {
            console.log(err);
            Promise.reject(err);
        })

    handleCellClick(id) {
        return () => {
            this.props.history.push(`/arrangement/${id}`);
        };
    }

    handleDeleteArrangement = arrangement => () => {
        const deletedArrangement = {
            ...arrangement,
            is_deleted: true,
        };
        updateArrangement(deletedArrangement)
            .then((response) => {
                this.props.enqueueSnackbar('Deleted Arrangement');
                this.loadArrangements();
                Promise.resolve();
            })
            .catch((err) => {
                Promise.reject(err);
            });
    }

    handleCopyArrangement = (arrangement) => {
        const d = new Date();

        return () => {
            const clonedArrangement = {
                ...cloneDeep(arrangement),
                _id: uuid('arrangement'),
                users: [this.props.account.user.googleId],
                owner: this.props.account.user.googleId,
                name: `${arrangement.name} copy`,
                timestamp: d.getTime() / 1000,
                modified_timestamp: d.getTime() / 1000,
            };
            updateArrangement(clonedArrangement)
                .then((response) => {
                    this.props.enqueueSnackbar('Copied Arrangement');
                    this.loadArrangements();
                    Promise.resolve();
                })
                .catch((err) => {
                    Promise.reject(err);
                });
        };
    }

    getNameFromGoogleId = (id) => {
        const user = this.props.users.filter(u => u.googleId === id);
        if (user.length === 1) {
            return user[0].name;
        }
        return id;
    }

    componentDidMount() {
        this.loadArrangements();
    }

    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Arrangement Name</TableCell>
                        <TableCell align="right">Owner</TableCell>
                        <TableCell align="right">Last Modified</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.arrangements.filter(row => !row.is_deleted).map(row => (
                        <TableRow hover={true} key={row._id}>
                            <TableCell component="th" scope="row" onClick={this.handleCellClick(row._id)} >
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{this.getNameFromGoogleId(row.owner)}</TableCell>
                            <TableCell align="right"><Timestamp time={row.modified_timestamp} format="full" /></TableCell>
                            <TableCell align="right">
                                <Tooltip title="Delete">
                                    <IconButton onClick={this.handleDeleteArrangement(row)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Copy">
                                    <IconButton onClick={this.handleCopyArrangement(row)}>
                                        <FileCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const {
        arrangements,
        users,
        account,
    } = state;
    return {
        arrangements,
        users,
        account,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    setArrangements: (arrangements) => {
        dispatch(setArrangements(arrangements));
    },
});

export default withSnackbar(withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(AllArrangementsTable)));
