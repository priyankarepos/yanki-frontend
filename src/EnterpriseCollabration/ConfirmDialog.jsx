import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

const ConfirmDialog = ({ open, handleClose, handleConfirm, confirmationText,loading }) => {
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
        <Button style={{ textTransform: "none", fontWeight: "600", minWidth: "120px" }} onClick={handleConfirm} color="error"  disabled={loading}>
        {loading ? <CircularProgress size={24} style={{ color: "#fff" }} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;