import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Modal, TextField } from '@material-ui/core'
import { get } from 'services/request'
import { setTSVExport } from 'actions/exportData/exportData'
import { EXPORT_ARRANGEMENT } from 'services/servicetypes'

const styles = theme => ({
  paper: {
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

  exportToTSV () {
    get({
      url: `${EXPORT_ARRANGEMENT}/EPQPQmmmm/tsv`
      // url: `${EXPORT_ARRANGEMENT}/${this.props.real._id}/tsv`
    })
      .then(response => {
        this.props.setTSVExport(response.data);
        this.setState({ open: true });
        Promise.resolve()
      })
  }

  handleOpen = () => {
    this.exportToTSV()
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleOpen}>
          Export
        </Button>
        <Modal style={{
            top: `30%`,
            left: `30%`,
            backgroundColor: 'white',
            outline: 'none',
          }}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={{ backgroundColor:'white', width: 200 }} >
            <Typography variant="headline" id="modal-title" gutterBottom align="center"
                
            >
              Exported Arrangement
              
            </Typography>
            <TextField id="simple-modal-description" disabled multiline defaultValue={this.props.exportData.TSV} />
            
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
) (ExportButton);