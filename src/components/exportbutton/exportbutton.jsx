import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Modal, TextField, List, ListItem, ListItemText} from '@material-ui/core'
import { get } from 'services/request'
import { setTSVExport } from 'actions/exportData/exportData'
import { EXPORT_ARRANGEMENT } from 'services/serviceTypes'

const styles = theme => ({
    paper: {
        top: `30%`,
        left: `30%`,
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

class SimpleModal extends React.Component {
    state = {
        open: false,
    }

    exportToTSV() {
        get({
                url: `${EXPORT_ARRANGEMENT}/${this.props.real._id}/tsv`
            })
            .then(response => {
                this.props.setTSVExport(response.data);
                this.setState({
                    open: true
                });
                Promise.resolve()
            })
    }

    handleOpen = () => {
        this.exportToTSV()
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    generate(element) {
        return [0, 1, 2].map(value =>
            React.cloneElement(element, {
                key: value,
            }),
        );
    }

    render() {
        const { classes } = this.props;
        return (
        <div>
            <Button variant="outlined" color="primary" onClick={this.handleOpen}>
                Export
            </Button>
            <Modal open={this.state.open} onClose={this.handleClose}>
                <div className={classes.paper}>
                    <Typography variant="headline" id="modal-title" gutterBottom align="center">
                        Exported Arrangement
                    </Typography>
                    <div>
                        <List dense={true}>
                        <ListItem>
                            <ListItemText
                            primary="1. Make sure the text is selected in the text area below"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                            primary="2. Press Ctrl-C (Windows) / ⌘-C (Mac) to copy"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                            primary="3. Paste into a spreadsheet"
                            />
                        </ListItem>
                        </List>
                    </div>
                    <TextField variant="outlined" disabled multiline defaultValue={this.props.exportData.TSV} />        
                </div>
            </Modal>
        </div>
        );
    }
}

SimpleModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const {
        real,
        exportData
    } = state
    return {
        real,
        exportData
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setTSVExport: (tsvData) => {
            dispatch(setTSVExport(tsvData))
        },
    }
}

// We need an intermediary variable for handling the recursive nesting.
const ExportButton = withStyles(styles)(SimpleModal);
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ExportButton);