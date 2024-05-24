import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

const ConfirmDialog = ({ open, handleClose, handleConfirm, confirmationText, loading, confirmationTitle}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{!confirmationTitle ? "Confirm Deletion" : confirmationTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {confirmationText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button className='confirm-delete-button' onClick={handleClose}>Cancel</Button>
        <Button className='confirm-delete-button' onClick={handleConfirm} color="error"  disabled={loading}>
        {loading ? <CircularProgress size={24} className='enterprise-white-color' /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;