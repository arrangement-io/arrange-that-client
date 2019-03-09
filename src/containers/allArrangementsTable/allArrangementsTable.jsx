import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { updateArrangement } from 'services/arrangementService'
import { setArrangements } from 'actions/arrangements/arrangements'

class AllArrangementsTable extends Component {
    constructor(props) {
        super(props);
   }

    handleCellClick (id) {
        return () => {
            this.props.history.push('/arrangement/' + id)
        }
    }

    // Figure out why it doesn't rerender
    handleDeleteArrangement = (arrangement) => {
        return () => {
            const deletedArrangement = {
                ...arrangement,
                is_deleted: true
            }
            updateArrangement(deletedArrangement)
                .then(response => {
                    console.log("deleted arrangement")
                    this.props.setArrangements(this.props.arrangements.filter(a => a._id !== deletedArrangement._id))
                    Promise.resolve()
                })
                .catch(err => {
                    Promise.reject(err)
                })
        }
    }

    render () {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Arrangement Name</TableCell>
                        <TableCell align="right">Owner</TableCell>
                        <TableCell align="right">Last Modified</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.arrangements.filter(row => !row.is_deleted).map(row => (
                        <TableRow hover={true} key={row._id}>
                            <TableCell component="th" scope="row" onClick={this.handleCellClick(row._id)} >
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.owner}</TableCell>
                            <TableCell align="right">{row.modified_timestamp}</TableCell>
                            <TableCell align="right"><DeleteIcon onClick={this.handleDeleteArrangement(row)}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {
        arrangements
    } = state
    return {
        arrangements
    }
}
  
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setArrangements: (arrangements) => {
            dispatch(setArrangements(arrangements))
        }
    }
}
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
) (AllArrangementsTable))
