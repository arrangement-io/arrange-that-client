import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Modal, TextField, List, ListItem, ListItemText } from '@material-ui/core';
import { setTSVExport } from 'actions/exportData/exportData';
import { getExportArrangement } from 'services/arrangementService';

const styles = theme => ({
    paper: {
        top: '30%',
        left: '30%',
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

    constructor(props) {
        super(props);
        this.textRef = React.createRef();
    }

    exportToTSV() {
        getExportArrangement(this.props.real, 'tsv')
            .then((response) => {
                this.props.setTSVExport(response.data);
                this.setState({
                    open: true,
                });
                Promise.resolve();
            });
    }

    handleOpen = () => {
        this.exportToTSV();
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    generate(element) {
        return [0, 1, 2].map(value =>
            React.cloneElement(element, {
                key: value,
            }));
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
                        <Typography variant="h5" id="modal-title" gutterBottom align="center">
                        Exported Arrangement
                        </Typography>
                        <div>
                            <List dense={true}>
                                <ListItem>
                                    <ListItemText
                                        primary='1. Click the "Copy to Clipboard" Button'
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="2. Paste into a spreadsheet"
                                    />
                                </ListItem>
                            </List>
                        </div>
                        <Button color="primary" onClick={() => { this.textRef.select(); document.execCommand('copy'); }}>
                        Copy to Clipboard
                        </Button>
                        <TextField variant="outlined" margin="normal" rows="4" ref={this.textRef}
                            InputProps={{ readOnly: true }} fullWidth multiline
                            value={this.props.exportData.TSV} inputRef={(e) => { this.textRef = e; }}/>
                    </div>
                </Modal>
            </div>
        );
    }
}

SimpleModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    const {
        real,
        exportData,
    } = state;
    return {
        real,
        exportData,
    };
};

const mapDispatchToProps = dispatch => ({
    setTSVExport: (tsvData) => {
        dispatch(setTSVExport(tsvData));
    },
});

// We need an intermediary variable for handling the recursive nesting.
const ExportButton = withStyles(styles)(SimpleModal);
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ExportButton);
