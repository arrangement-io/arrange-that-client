import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import PropTypes from 'prop-types';
import { Link, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

class AllArrangementsTable extends Component {
    handleCellClick (id) {
        return () => {
            console.log(id)
            console.log(this.props)
            this.props.history.push('/arrangement/' + id)
        }
    }

    render () {
        console.log(this.props.arrangements)
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Arrangement Name</TableCell>
                        <TableCell align="right">Owner</TableCell>
                        <TableCell align="right">Last Modified</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.arrangements.map(row => (
                        <TableRow hover={true} onClick={this.handleCellClick(row._id)} key={row._id}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.owner}</TableCell>
                            <TableCell align="right">{row.modified_timestamp}</TableCell>
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
    }
}
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
) (AllArrangementsTable))
