import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ConfirmDialog = ({ open, handleClose, handleConfirm, confirmationText }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {confirmationText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button style={{ textTransform: "none", fontWeight: "600", minWidth: "120px" }} onClick={handleClose}>Cancel</Button>
        <Button style={{ textTransform: "none", fontWeight: "600", minWidth: "120px" }} onClick={handleConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;