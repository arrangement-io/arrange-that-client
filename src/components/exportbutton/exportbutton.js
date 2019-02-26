import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, Modal, TextField } from '@material-ui/core'

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.exportToTSV}>
          Export
        </Button>
        <Modal style={{
            top: `30%`,
            left: `30%`,
            backgroundColor: 'white',
            outline: 'none',
          }}
          open={this.state.showTSV}
          onClose={() => this.setState({ showTSV: false })}
        >
          <div style={{ backgroundColor:'white', width: 200 }} >
            <Typography variant="headline" id="modal-title" gutterBottom align="center"
                
            >
              Exported Arrangement
              
            </Typography>
            <TextField id="simple-modal-description" disabled multiline defaultValue={this.state.exportText} />
            
          </div>
        </Modal>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const ExportButton = withStyles(styles)(SimpleModal);

export default ExportButton;